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
  
  func saveKey(encryptedKey: Data, prefix: String) throws -> Void {
    let path = getKeystorePath()
    let params = KeystoreParamsBIP32(encryptedKey: encryptedKey, id: UUID().uuidString.lowercased(), version: 1, path: prefix)
    let data = try! JSONEncoder().encode(params)
    
    guard FileManager.default.createFile(atPath: path, contents: data, attributes: nil) else {
      throw WalletManagerError(message: "Could not create key store.")
    }
  }
  
  func loadKey() throws -> Data? {
    guard let data = FileManager.default.contents(atPath: getKeystorePath()) else {
      return nil
    }
    guard let params = try? JSONDecoder().decode(KeystoreParamsBIP32.self, from: data) else {
      return nil
    }
    
    return params.encryptedKey
  }
  
  func findLocalPrivateKey(_ callback: @escaping ((SecKey?) -> Void)) -> Void {
    var context = LAContext()
    context.evaluatePolicy(.deviceOwnerAuthentication, localizedReason: "Unlock your wallet" ) { success, error in
      if success {
        DispatchQueue.main.async { [unowned self] in
          let query: [String: Any] = [kSecClass as String: kSecClassKey,
                                      kSecAttrKeyClass as String: kSecAttrKeyClassPrivate,
                                      kSecReturnRef as String: true,
                                      kSecAttrLabel as String: "io.mobidex.app.key".data(using: .utf8)!,
                                      kSecMatchLimit as String: kSecMatchLimitOne,
                                      kSecUseOperationPrompt as String: "Unlock your mobidex wallet"]
          var item: CFTypeRef?
          guard SecItemCopyMatching(query as CFDictionary, &item) == errSecSuccess else {
            print("could not find match")
            callback(nil)
            return
          }
          guard item != nil else {
            print("could not find match")
            callback(nil)
            return
          }
          callback(item as! SecKey)
          return
        }
      } else {
        callback(nil)
        return
      }
    }
  }

  @available(iOS 10.0, *)
  func generateLocalKeys() throws -> (SecKey?, SecKey?) {
    let access =
      SecAccessControlCreateWithFlags(kCFAllocatorDefault,
                                      kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
                                      [.privateKeyUsage, .userPresence],
//                                      .privateKeyUsage,
                                      nil)!
    let privateKeyParams: [String: Any] = [
      kSecAttrLabel as String: "io.mobidex.app.key".data(using: .utf8)!,
      kSecAttrAccessControl as String: access,
      kSecAttrIsPermanent as String: true
    ]
    var attributes: [String: Any] = [
      kSecAttrKeyType as String: attrKeyTypeEllipticCurve,
      kSecAttrKeySizeInBits as String: 256,
      kSecPrivateKeyAttrs as String: privateKeyParams
    ]
    if Device.hasSecureEnclave {
      attributes[kSecAttrTokenID as String] = kSecAttrTokenIDSecureEnclave
    }
    
    var publicKey, privateKey: SecKey?, error: Unmanaged<CFError>?
    privateKey = SecKeyCreateRandomKey(attributes as CFDictionary, &error)
    guard privateKey != nil else {
      throw error!.takeRetainedValue() as Error
    }
    publicKey = SecKeyCopyPublicKey(privateKey!)
    
    return (privateKey, publicKey)
  }
  
  func generateAccount(_ mnemonic: String) -> ( web3swift.HDNode, String )? {
    var prefix = web3swift.HDNode.defaultPathMetamaskPrefix
    var newIndex = UInt32(0)
    var seed = web3swift.BIP39.seedFromMmemonics(mnemonic, password: "", language: web3swift.BIP39Language.english)!
    defer{ Data.zero(&seed) }
    
    guard let prefixNode = HDNode(seed: seed)?.derive(path: prefix, derivePrivateKey: true) else {
      return nil
    }
    guard let newNode = prefixNode.derive(index: newIndex, derivePrivateKey: true, hardened: false) else {
      return nil
    }
    
    var newPath:String
    if newNode.isHardened {
      newPath = prefix + "/" + String(newNode.index % HDNode.hardenedIndexPrefix) + "'"
    } else {
      newPath = prefix + "/" + String(newNode.index)
    }
    
    return ( newNode, newPath )
  }
  
  @available(iOS 10.0, *)
  func encryptKey(publicKey: SecKey, key: Data) throws -> Data? {
    var error: Unmanaged<CFError>?
    guard let cipherText = SecKeyCreateEncryptedData(publicKey,
                                               .eciesEncryptionStandardX963SHA256AESGCM,
                                               key as CFData,
                                               &error) as Data? else {
                                                  throw error!.takeRetainedValue() as Error
    }
    
    return cipherText as Data
  }
  
  @available(iOS 10.0, *)
  func decryptKey(privateKey: SecKey, encryptedKey: Data) -> Data? {
    var error: Unmanaged<CFError>?
    print(privateKey)
    guard let data = SecKeyCreateDecryptedData(privateKey,
                                               .eciesEncryptionStandardX963SHA256AESGCM,
                                               encryptedKey as CFData,
                                               &error) else {
                                                return nil
    }

    return data as Data
  }
  
  @objc(doesWalletExist:) func doesWalletExist(callback: RCTResponseSenderBlock) -> Void {
    guard let encryptedKey = try! loadKey() else {
      callback([NSNull(), false])
      return
    }
    
    callback([NSNull(), true])
  }
  
  @objc(generateMnemonics:) func generateMnemonics(callback: RCTResponseSenderBlock) -> Void {
    let mnemonic = try! web3swift.BIP39.generateMnemonics(bitsOfEntropy: 128)
    callback([NSNull(), mnemonic])
  }

  @objc(importWalletByMnemonics:callback:) func importWalletByMnemonics(mnemonic: String, callback: RCTResponseSenderBlock) -> Void {
    guard let (node, path) = generateAccount(mnemonic) else {
      callback([NSNull(), NSNull()])
      return;
    }
    
    if node.privateKey == nil {
      callback([NSNull(), NSNull()])
      return;
    }
    
    let (_, publicKey) = try! generateLocalKeys()
    let encryptedKey = try! encryptKey(publicKey: publicKey!, key: node.privateKey!)
    try! saveKey(encryptedKey: encryptedKey!, prefix: path)
    callback([NSNull(), node.privateKey!.toHexString()])
  }
  
  @objc(loadWallet:) func loadWallet(callback: @escaping RCTResponseSenderBlock) -> Void {
    guard let encryptedKey = try! loadKey() else {
      callback([NSNull(), NSNull()])
      return
    }
    findLocalPrivateKey({ pkref in
      guard pkref != nil else {
        callback([NSNull(), NSNull()])
        return
      }
      
      guard let privateKey = self.decryptKey(privateKey: pkref!, encryptedKey: encryptedKey) else {
        callback([NSNull(), NSNull()])
        return
      }
      
      callback([NSNull(), privateKey.toHexString()])
    })
  }
}

