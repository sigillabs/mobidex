//
//  WalletManager.swift
//  mobidex
//
//  Created by Abraham Elmahrek on 6/18/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import LocalAuthentication

import web3swift

struct WalletManagerError: Error {
  let message: String
  
  init(message: String) {
    self.message = message
  }
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
    let keystoreManager = KeystoreManager.managerForPath(getKeystoreDirectory(), scanForHDwallets: true)
    return keystoreManager?.walletForAddress((keystoreManager?.addresses![0])!) as? web3swift.BIP32Keystore
  }
  
//  func saveKey(encryptedKey: Data, prefix: String) throws -> Void {
//    let directory = getKeystoreDirectory()
//    let path = getKeystorePath()
//    let url = URL(fileURLWithPath: path)
//    let params = KeystoreParamsBIP32(encryptedKey: encryptedKey, id: UUID().uuidString.lowercased(), version: 1, path: prefix)
//    let data = try! JSONEncoder().encode(params)
//    try! FileManager.default.removeItem(atPath: directory)
//    try! FileManager.default.createDirectory(atPath: directory, withIntermediateDirectories: true, attributes: nil)
//    try! data.write(to: url)
//  }
//
//  func loadKey() throws -> Data? {
//    guard let data = FileManager.default.contents(atPath: getKeystorePath()) else {
//      return nil
//    }
//    guard let params = try? JSONDecoder().decode(KeystoreParamsBIP32.self, from: data) else {
//      return nil
//    }
//
//    return params.encryptedKey
//  }
  
//  func findLocalPrivateKey(password: String?, callback: @escaping ((SecKey?) -> Void)) -> Void {
//    let context = LAContext()
//    context.localizedFallbackTitle = "";
//
//    var policy = LAPolicy.deviceOwnerAuthenticationWithBiometrics
//
//    print(password)
//    if password != nil {
//      print("set credentials")
//      policy = LAPolicy.deviceOwnerAuthentication
//      context.setCredential(password!.data(using: .utf8), type: LACredentialType.applicationPassword)
//
//      let query: [String: Any] = [kSecClass as String: kSecClassKey,
//                                  kSecAttrKeyClass as String: kSecAttrKeyClassPrivate,
//                                  kSecReturnRef as String: true,
//                                  kSecAttrLabel as String: "io.mobidex.app.key".data(using: .utf8)!,
//                                  kSecMatchLimit as String: kSecMatchLimitOne,
//                                  kSecUseAuthenticationUISkip as String: true//,
//        //                                      kSecUseOperationPrompt as String: "Unlock your mobidex wallet",
//      ]
//      var item: CFTypeRef?
//      guard SecItemCopyMatching(query as CFDictionary, &item) == errSecSuccess else {
//        print("could not find match")
//        callback(nil)
//        return
//      }
//      guard item != nil else {
//        print("could not find match")
//        callback(nil)
//        return
//      }
//      callback(item as! SecKey)
//      return
//    } else {
//      context.evaluatePolicy(policy, localizedReason: "Unlock your wallet") { success, error in
//        if success {
//          DispatchQueue.main.async { [unowned self] in
//            let query: [String: Any] = [kSecClass as String: kSecClassKey,
//                                        kSecAttrKeyClass as String: kSecAttrKeyClassPrivate,
//                                        kSecReturnRef as String: true,
//                                        kSecAttrLabel as String: "io.mobidex.app.key".data(using: .utf8)!,
//                                        kSecMatchLimit as String: kSecMatchLimitOne,
//                                        kSecUseAuthenticationUISkip as String: true//,
//                                        //                                      kSecUseOperationPrompt as String: "Unlock your mobidex wallet",
//            ]
//            var item: CFTypeRef?
//            guard SecItemCopyMatching(query as CFDictionary, &item) == errSecSuccess else {
//              print("could not find match")
//              callback(nil)
//              return
//            }
//            guard item != nil else {
//              print("could not find match")
//              callback(nil)
//              return
//            }
//            callback(item as! SecKey)
//            return
//          }
//        } else {
//          callback(nil)
//          return
//        }
//      }
//    }
//
//    context.evaluatePolicy(policy, localizedReason: "Unlock your wallet") { success, error in
//      if success {
//        DispatchQueue.main.async { [unowned self] in
//          let query: [String: Any] = [kSecClass as String: kSecClassKey,
//                                      kSecAttrKeyClass as String: kSecAttrKeyClassPrivate,
//                                      kSecReturnRef as String: true,
//                                      kSecAttrLabel as String: "io.mobidex.app.key".data(using: .utf8)!,
//                                      kSecMatchLimit as String: kSecMatchLimitOne,
////                                      kSecUseOperationPrompt as String: "Unlock your mobidex wallet",
//                                      kSecUseAuthenticationUISkip as String: true]
//          var item: CFTypeRef?
//          guard SecItemCopyMatching(query as CFDictionary, &item) == errSecSuccess else {
//            print("could not find match")
//            callback(nil)
//            return
//          }
//          guard item != nil else {
//            print("could not find match")
//            callback(nil)
//            return
//          }
//          callback(item as! SecKey)
//          return
//        }
//      } else {
//        callback(nil)
//        return
//      }
//    }
//  }
//  @available(iOS 10.0, *)
//  func generateLocalKeys(password: String) throws -> (SecKey?, SecKey?) {
//    let context = LAContext()
//    context.localizedFallbackTitle = "";
//    context.setCredential(password.data(using: .utf8), type: LACredentialType.applicationPassword)
//
//    let access =
//      SecAccessControlCreateWithFlags(kCFAllocatorDefault,
//                                      kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
//                                      [.privateKeyUsage, .userPresence],
////                                      [.privateKeyUsage, .userPresence, .applicationPassword],
////                                      .privateKeyUsage,
//                                      nil)!
//    let privateKeyParams: [String: Any] = [
//      kSecAttrLabel as String: "io.mobidex.app.key".data(using: .utf8)!,
//      kSecAttrAccessControl as String: access,
//      kSecAttrIsPermanent as String: true
//    ]
//    var attributes: [String: Any] = [
//      kSecAttrKeyType as String: attrKeyTypeEllipticCurve,
//      kSecAttrKeySizeInBits as String: 256,
//      kSecPrivateKeyAttrs as String: privateKeyParams
//    ]
//    if Device.hasSecureEnclave {
//      attributes[kSecAttrTokenID as String] = kSecAttrTokenIDSecureEnclave
//    }
//
//    var publicKey, privateKey: SecKey?, error: Unmanaged<CFError>?
//    privateKey = SecKeyCreateRandomKey(attributes as CFDictionary, &error)
//    guard privateKey != nil else {
//      throw error!.takeRetainedValue() as Error
//    }
//    publicKey = SecKeyCopyPublicKey(privateKey!)
//
//    return (privateKey, publicKey)
//  }
//
//  func generateAccount(_ mnemonic: String) -> ( web3swift.HDNode, String )? {
//    var prefix = web3swift.HDNode.defaultPathMetamaskPrefix
//    var newIndex = UInt32(0)
//    var seed = web3swift.BIP39.seedFromMmemonics(mnemonic, password: "", language: web3swift.BIP39Language.english)!
//    defer{ Data.zero(&seed) }
//
//    guard let prefixNode = HDNode(seed: seed)?.derive(path: prefix, derivePrivateKey: true) else {
//      return nil
//    }
//    guard let newNode = prefixNode.derive(index: newIndex, derivePrivateKey: true, hardened: false) else {
//      return nil
//    }
//
//    var newPath:String
//    if newNode.isHardened {
//      newPath = prefix + "/" + String(newNode.index % HDNode.hardenedIndexPrefix) + "'"
//    } else {
//      newPath = prefix + "/" + String(newNode.index)
//    }
//
//    return ( newNode, newPath )
//  }
  
//  @available(iOS 10.0, *)
//  func encryptKey(publicKey: SecKey, key: Data) throws -> Data? {
//    var error: Unmanaged<CFError>?
//    guard let cipherText = SecKeyCreateEncryptedData(publicKey,
//                                               .eciesEncryptionStandardX963SHA256AESGCM,
//                                               key as CFData,
//                                               &error) as Data? else {
//                                                  throw error!.takeRetainedValue() as Error
//    }
//
//    return cipherText as Data
//  }
//
//  @available(iOS 10.0, *)
//  func decryptKey(privateKey: SecKey, encryptedKey: Data) -> Data? {
//    var error: Unmanaged<CFError>?
//    print(privateKey)
//    guard let data = SecKeyCreateDecryptedData(privateKey,
//                                               .eciesEncryptionStandardX963SHA256AESGCM,
//                                               encryptedKey as CFData,
//                                               &error) else {
//                                                return nil
//    }
//
//    return data as Data
//  }
//  @objc(importWalletByMnemonics:password:callback:) func importWalletByMnemonics(mnemonic: String, password: String, callback: RCTResponseSenderBlock) -> Void {
//    guard let (node, path) = generateAccount(mnemonic) else {
//      callback([NSNull(), NSNull()])
//      return;
//    }
//
//    if node.privateKey == nil {
//      callback([NSNull(), NSNull()])
//      return;
//    }
//
//    let (_, publicKey) = try! generateLocalKeys(password: password)
//    let encryptedKey = try! encryptKey(publicKey: publicKey!, key: node.privateKey!)
//    try! saveKey(encryptedKey: encryptedKey!, prefix: path)
//    callback([NSNull(), node.privateKey!.toHexString()])
//  }

  
  func getPasscodeFromKeychain() throws -> String? {
    let query: [String: Any] = [
      kSecClass as String: kSecClassGenericPassword,
      kSecReturnData as String: true,
      kSecReturnAttributes as String: true,
      kSecAttrLabel as String: "io.mobidex.app.password".data(using: .utf8)!,
      kSecMatchLimit as String: kSecMatchLimitOne,
      kSecUseOperationPrompt as String: "Unlock your wallet",
    ]
    
    var item: CFTypeRef?
    let status = SecItemCopyMatching(query as CFDictionary, &item)
    guard status != errSecItemNotFound else { return nil }
    guard status == errSecSuccess else { throw WalletManagerError(message: "Could not fetch item. Status Code: " + String(status)) }
    guard let existingItem = item as? [String : Any],
      let passwordData = existingItem[kSecValueData as String] as? Data,
      let password = String(data: passwordData, encoding: .utf8)
      else { throw WalletManagerError(message: "Data in keychain is bad.") }
    
    return password
  }
  
  
  func storePasscodeInKeychain(password: String) throws -> Void {
    let access = SecAccessControlCreateWithFlags(nil,
      kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly,
      .userPresence,
      nil)
    let context = LAContext()
    context.touchIDAuthenticationAllowableReuseDuration = 10

    let query: [String: Any] = [
      kSecClass as String: kSecClassGenericPassword,
      kSecAttrLabel as String: "io.mobidex.app.password".data(using: .utf8)!,
      kSecValueData as String: password.data(using: .utf8)!,
      kSecAttrAccessControl as String: access as Any,
      kSecUseAuthenticationContext as String: context
    ]
    
    let status = SecItemAdd(query as CFDictionary, nil)
    guard status == errSecSuccess else { throw WalletManagerError(message: "Could not store passcode in keychain. Status code: " + String(status)) }
  }
  
  func ensurePasscode(_ password: String?) throws -> String {
    if password != nil {
      return password!
    }
    guard let realpass = try! getPasscodeFromKeychain() else {
      throw WalletManagerError(message: "Could not get password.")
    }
    return realpass
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
  
  @objc(doesWalletExist:) func doesWalletExist(callback: RCTResponseSenderBlock) -> Void {
    guard let manager = KeystoreManager.managerForPath(getKeystoreDirectory(), scanForHDwallets: true),
      let addresses = manager.addresses,
      addresses.count > 0 else {
        callback([NSNull(), false])
        return;
    }
    
    callback([NSNull(), true])
  }
  
  @objc(generateMnemonics:) func generateMnemonics(callback: RCTResponseSenderBlock) -> Void {
    let mnemonic = try! web3swift.BIP39.generateMnemonics(bitsOfEntropy: 128)
    callback([NSNull(), mnemonic as Any])
  }
  
  @objc(importWalletByMnemonics:password:callback:) func importWalletByMnemonics(mnemonic: String, password: String?, callback: RCTResponseSenderBlock) -> Void {
    do {
      let realpass = try ensurePasscode(password)
      
      // Do not provide password -- only mnemonicsPassword
      guard let store = try web3swift.BIP32Keystore(mnemonics: mnemonic, password: realpass, mnemonicsPassword: ""),
        let params = store.keystoreParams,
        let addresses = store.addresses,
        addresses.count != 0
        else {
          callback([NSNull(), NSNull()])
          return;
        }
      
      try saveKeystore(params: params)
      
      let privateKey = try store.UNSAFE_getPrivateKeyData(password: realpass, account: addresses[0])
      callback([NSNull(), privateKey.toHexString()])
    } catch let error as NSError {
      print(error.localizedDescription);
      callback([error, NSNull()])
    }
  }

  
  @objc(loadWallet:callback:) func loadWallet(password: String?, callback: @escaping RCTResponseSenderBlock) -> Void {
    guard let store = findWallet(),
      let addresses = store.addresses,
      addresses.count != 0
      else {
        callback([NSNull(), NSNull()])
        return;
      }

    do {
      let realpass = try ensurePasscode(password)
      let privateKey = try store.UNSAFE_getPrivateKeyData(password: realpass, account: addresses[0])
      callback([NSNull(), privateKey.toHexString()])
    } catch let error as NSError {
      print(error.localizedDescription);
      callback([error, NSNull()])
    }
  }
}

