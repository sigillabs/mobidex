//
//  WalletManager.swift
//  mobidex
//
//  Created by Abraham Elmahrek on 6/18/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

import web3swift

@objc(WalletManager)
class WalletManager: NSObject {
  func getKeystoreDirectory() -> String {
    let userDir = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]
    return userDir + "/bip39keystore"
  }
  
  func getKeystorePath() -> String {
    return getKeystoreDirectory() + "/key.json"
  }
  
  func saveKeystore(params: KeystoreParamsBIP32) throws -> Void {
    let path = getKeystorePath()
    let data = try! JSONEncoder().encode(params)
    
    do {
      FileManager.default.createFile(atPath: path, contents: data, attributes: nil)
    } catch let error as NSError {
      print(error.localizedDescription);
    }
  }
  
  func loadWallet() -> web3swift.BIP32Keystore? {
    let keystoreManager = KeystoreManager.managerForPath(getKeystoreDirectory(), scanForHDwallets: true)
    return keystoreManager?.walletForAddress((keystoreManager?.addresses![0])!) as! web3swift.BIP32Keystore
  }
  
  @objc(doesWalletExist:) func doesWalletExist(callback: RCTResponseSenderBlock) -> Void {
    let manager = KeystoreManager.managerForPath(getKeystoreDirectory(), scanForHDwallets: true)
    if (manager?.addresses?.count)! > 0 {
      callback([NSNull(), true])
    } else {
      callback([NSNull(), false])
    }
  }
  
  @objc(generateMnemonics:) func generateMnemonics(callback: RCTResponseSenderBlock) -> Void {
    let mnemonics = try! web3swift.BIP39.generateMnemonics(bitsOfEntropy: 128)
    callback([NSNull(), mnemonics])
  }
  
  @objc(importWalletByMnemonics:password:callback:) func importWalletByMnemonics(mnemonics: String, password: String, callback: RCTResponseSenderBlock) -> Void {
    do {
      let seed = web3swift.BIP39.seedFromMmemonics(mnemonics, password: password, language: web3swift.BIP39Language.english)!
      // Do not provide password -- only mnemonicsPassword
      let store = try web3swift.BIP32Keystore(mnemonics: mnemonics, password: password, mnemonicsPassword: "")
      
      if store == nil {
        callback([NSNull(), NSNull()])
        return;
      }
      
      if store?.keystoreParams == nil {
        callback([NSNull(), NSNull()])
        return;
      }
      
      if store?.addresses == nil {
        callback([NSNull(), NSNull()])
        return;
      }
      
      if store!.addresses!.count == 0 {
        callback([NSNull(), NSNull()])
        return;
      }
      
      try saveKeystore(params: store!.keystoreParams!)
      
      let privateKey = try store!.UNSAFE_getPrivateKeyData(password: password, account: store!.addresses![0])
      callback([NSNull(), privateKey.toHexString()])
    } catch let error as NSError {
      print(error.localizedDescription);
      callback([error, NSNull()])
    }
  }
  
  @objc(loadWallet:callback:) func loadWallet(password: String, callback: RCTResponseSenderBlock) -> Void {
    let store = loadWallet()
    
    if store == nil {
      callback([NSNull(), NSNull()])
      return;
    }
    
    do {
      let privateKey = try store!.UNSAFE_getPrivateKeyData(password: password, account: store!.addresses![0])
      callback([NSNull(), privateKey.toHexString()])
    } catch let error as NSError {
      print(error.localizedDescription);
      callback([error, NSNull()])
    }
  }
}

