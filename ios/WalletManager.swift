//
//  WalletManager.swift
//  mobidex
//
//  Created by Abraham Elmahrek on 6/18/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import LocalAuthentication

import BigInt
import web3swift

struct WalletManagerError: Error {
  let message: String
  
  init(message: String) {
    self.message = message
  }
}

func padToEven(_ hex: String) -> String {
  if hex.count % 2 != 0 {
    return "0"+hex
  } else {
    return hex
  }
}

func stripHexPrefix(_ hex: String) -> String {
  if hex.starts(with: "0x") {
    return hex.substring(from: String.Index(2))
  } else {
    return hex
  }
}

func hexToPaddedData(_ hex: String) -> Data {
  return Data(hex: padToEven(stripHexPrefix(hex)))
}

func hexToPaddedBigUInt(_ hex: String) -> BigUInt {
  return BigUInt(hexToPaddedData(hex))
}

@objc(WalletManager)
class WalletManager: NSObject {
  private var attrKeyTypeEllipticCurve: String {
    if #available(iOS 10.0, *) {
      return kSecAttrKeyTypeECSECPrimeRandom as String
    } else {
      return kSecAttrKeyTypeEC as String
    }
  }

  func getKeystoreDirectory() -> String {
    let userDir = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]
    return userDir + "/bip39keystore"
  }
  
  func getKeystorePath() -> String {
    return getKeystoreDirectory() + "/key.json"
  }

  func saveKeystore(params: KeystoreParamsBIP32) throws -> Void {
    let directory = getKeystoreDirectory()
    let path = getKeystorePath()
    let url = URL(fileURLWithPath: path)
    let data = try! JSONEncoder().encode(params)
    
    try! FileManager.default.removeItem(atPath: directory)
    try! FileManager.default.createDirectory(atPath: directory, withIntermediateDirectories: true, attributes: nil)
    try! data.write(to: url)
  }
  
  func findWallet() -> web3swift.BIP32Keystore? {
    guard let keystoreManager = KeystoreManager.managerForPath(getKeystoreDirectory(), scanForHDwallets: true),
      let addresses = keystoreManager.addresses,
      addresses.count > 0
      else {
      return nil
    }
    return (keystoreManager.walletForAddress(addresses[0]) as! web3swift.BIP32Keystore)
  }

  func getPasscodeFromKeychain(callback: @escaping (Error?, String?) -> Void) -> Void {
    let context = LAContext()
    let policy = LAPolicy.deviceOwnerAuthenticationWithBiometrics
    // TODO: Remove evaluatePolicy and separate LAContext in favor of kSecUseOperationPrompt
    context.evaluatePolicy(policy, localizedReason: "Unlock your wallet") { success, error in
      if success {
        let query: [String: Any] = [
          kSecClass as String: kSecClassGenericPassword,
          kSecReturnData as String: true,
          kSecReturnAttributes as String: true,
          kSecAttrAccount as String: "mobidex",
          kSecAttrService as String: "io.mobidex.wallet.password",
          kSecMatchLimit as String: kSecMatchLimitOne,
          kSecUseAuthenticationContext as String: context,
//          kSecUseOperationPrompt as String: "Unlock your wallet",
//          kSecUseAuthenticationUI as String: true,
        ]
        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)
        guard status != errSecItemNotFound else {
          callback(WalletManagerError(message: "Could not find password"), nil)
          return
        }
        guard status == errSecSuccess else {
          callback(WalletManagerError(message: "Could not fetch item. Status Code: " + String(status)), nil)
          return
        }
        guard let existingItem = item as? [String : Any],
          let passwordData = existingItem[kSecValueData as String] as? Data,
          let password = String(data: passwordData, encoding: .utf8)
          else {
            callback(WalletManagerError(message: "Data in keychain is bad."), nil)
            return
        }
        callback(nil, password)
      } else {
        callback(nil, nil)
      }
    }
  }
  
  
  func storePasscodeInKeychain(_ password: String) throws -> Void {
    let access = SecAccessControlCreateWithFlags(nil,
      kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly,
      .userPresence,
      nil)
    let context = LAContext()
    context.touchIDAuthenticationAllowableReuseDuration = 10

    let query: [String: Any] = [
      kSecClass as String: kSecClassGenericPassword,
      kSecAttrAccount as String: "mobidex",
      kSecAttrService as String: "io.mobidex.app.password",
      kSecValueData as String: password.data(using: .utf8)!,
      kSecAttrAccessControl as String: access as Any,
      kSecUseAuthenticationContext as String: context
    ]
    
    let status = SecItemAdd(query as CFDictionary, nil)
    guard status == errSecSuccess else { throw WalletManagerError(message: "Could not store passcode in keychain. Status code: " + String(status)) }
  }
  
  func ensurePasscode(_ password: String?, callback: @escaping (Error?, String?) -> Void) -> Void {
    if password != nil && password! != "" {
      callback(nil, password)
      return
    }
    
    getPasscodeFromKeychain(callback: callback)
  }
  
  @objc(supportsFingerPrintAuthentication:) func supportsFingerPrintAuthentication(callback: RCTResponseSenderBlock) -> Void {
    let context = LAContext()
    var error:NSError?
    if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
      callback([NSNull(), true])
    } else {
      callback([NSNull(), false])
    }
  }
  
  @objc(cancelFingerPrintAuthentication:) func cancelFingerPrintAuthentication(callback: RCTResponseSenderBlock) -> Void {
    // Not Supported in iOS
    callback([NSNull(), NSNull()])
  }
  
  @objc(generateMnemonics:) func generateMnemonics(callback: RCTResponseSenderBlock) -> Void {
    let mnemonic = try! web3swift.BIP39.generateMnemonics(bitsOfEntropy: 128)
    callback([NSNull(), mnemonic as Any])
  }
  
  @objc(importWalletByMnemonics:password:callback:) func importWalletByMnemonics(mnemonic: String, password: String, callback: @escaping RCTResponseSenderBlock) -> Void {
    do {
      try storePasscodeInKeychain(password)

      // Do not provide password -- only mnemonicsPassword
      guard let store = try web3swift.BIP32Keystore(mnemonics: mnemonic, password: password, mnemonicsPassword: ""),
        let params = store.keystoreParams,
        let addresses = store.addresses,
        addresses.count != 0
        else {
          callback([NSNull(), NSNull()])
          return;
      }
      
      try self.saveKeystore(params: params)
      
      let privateKey = try store.UNSAFE_getPrivateKeyData(password: password, account: addresses[0])
      callback([NSNull(), privateKey.toHexString()])
    } catch let error as WalletManagerError {
      callback([error.localizedDescription, NSNull()])
    } catch let error as NSError {
      callback([error.localizedDescription, NSNull()])
    }
  }

  
  @objc(loadWallet:callback:) func loadWallet(password: String?, callback: @escaping RCTResponseSenderBlock) -> Void {
    ensurePasscode(password, callback: { error, password in
      guard error == nil else {
        callback([error!, NSNull()])
        return
      }
      
      guard let store = self.findWallet(),
        let addresses = store.addresses,
        addresses.count != 0
        else {
          callback([NSNull(), NSNull()])
          return;
      }
      
      guard password != nil else {
        callback([NSNull(), NSNull()])
        return;
      }
      
      do {
        let privateKey = try store.UNSAFE_getPrivateKeyData(password: password!, account: addresses[0])
        callback([NSNull(), privateKey.toHexString()])
      } catch let error {
        callback([error.localizedDescription, NSNull()])
      }
    })
  }
  
  @objc(loadWalletAddress:) func loadWalletAddress(callback: @escaping RCTResponseSenderBlock) -> Void {
    guard let store = self.findWallet(),
      let addresses = store.addresses,
      addresses.count != 0
      else {
        callback([NSNull(), NSNull()])
        return;
    }
    callback([NSNull(), addresses[0].addressData.toHexString()])
  }
  
  @objc(signTransaction:password:callback:) func signTransaction(tx: NSDictionary, password: String?, callback: @escaping RCTResponseSenderBlock) -> Void {
    ensurePasscode(password, callback: { error, password in
      guard error == nil else {
        callback([error!, NSNull()])
        return
      }
      
      guard let store = self.findWallet(),
        let addresses = store.addresses,
        addresses.count != 0
        else {
          callback([NSNull(), NSNull()])
          return;
      }
      
      guard password != nil else {
        callback([NSNull(), NSNull()])
        return;
      }

      let data = hexToPaddedData(tx["data"] as! String)
      let nonce = hexToPaddedBigUInt(tx["nonce"] as! String)
      var options = Web3Options()
      
      options.to = EthereumAddress(tx["to"] as! String)
      
      if (tx.object(forKey: "from") != nil) {
        options.from = EthereumAddress(tx["from"] as! String)
      }
      
      if (tx.object(forKey: "gas") != nil) {
        options.gasLimit = hexToPaddedBigUInt(tx["gas"] as! String)
      }
      
      if (tx.object(forKey: "gasPrice") != nil) {
        options.gasPrice = hexToPaddedBigUInt(tx["gasPrice"] as! String)
      }
      
      if (tx.object(forKey: "value") != nil) {
        options.value = hexToPaddedBigUInt(tx["value"] as! String)
      }

      var etx = EthereumTransaction(to: options.to!, data: data, options: options)
      etx.nonce = nonce

      try? web3swift.Web3Signer.signTX(transaction: &etx, keystore: store, account: addresses[0], password: password!)

      if etx.r.isEqualTo(BigUInt(0) as AnyObject) && etx.s.isEqualTo(BigUInt(0) as AnyObject) {
        callback([NSNull(), NSNull()])
        return;
      }

      callback([NSNull(), [
        "r": etx.r.serialize().toHexString(),
        "s": etx.s.serialize().toHexString(),
        "v": etx.v.serialize().toHexString(),
      ]])
    })
  }
  
  @objc(signMessage:password:callback:) func signMessage(message: String, password: String?, callback: @escaping RCTResponseSenderBlock) -> Void {
    ensurePasscode(password, callback: { error, password in
      guard error == nil else {
        callback([error!, NSNull()])
        return
      }
      
      guard let store = self.findWallet(),
        let addresses = store.addresses,
        addresses.count != 0
        else {
          callback([NSNull(), NSNull()])
          return;
      }
      
      guard password != nil else {
        callback([NSNull(), NSNull()])
        return;
      }
      
      let data = hexToPaddedData(message)
      var privateKey: Data? = nil

      do {
        privateKey = try store.UNSAFE_getPrivateKeyData(password: password!, account: addresses[0])
      } catch let error as NSError {
        callback([error.localizedDescription, NSNull()])
        return
      }

      defer { Data.zero(&privateKey!) }

      guard let signature = try? web3swift.Web3Signer.signPersonalMessage(data, keystore: store, account: addresses[0], password: password!),
        signature != nil else {
          callback([NSNull(), NSNull()])
          return;
      }

      callback([NSNull(), signature!.toHexString()])
    })
  }
}

