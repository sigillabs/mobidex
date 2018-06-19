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
  static let WALLET_PATH = "m/44'/60'/0'/0/0";
  
  @objc func doesWalletExist() -> Bool {
    return FileManager.default.fileExists(atPath: WalletManager.WALLET_PATH)
  }
  
  @objc func generateMnemonics() -> String? {
    return try! web3swift.BIP39.generateMnemonics(bitsOfEntropy: 128)
  }
  
  @objc func importWalletByMnemonics(mnemonics: String, password: String) throws -> String {
    let keyStore = try web3swift.BIP32Keystore(mnemonics: mnemonics, password: password, mnemonicsPassword: password, language: web3swift.BIP39Language.english)
    
    if keyStore != nil {
      return try keyStore!.UNSAFE_getPrivateKeyData(password: password, account: keyStore!.addresses![0]).toHexString()
    } else {
      return ""
    }
  }
  
  @objc func loadWallet(password: String) throws -> String {
    let userDir = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]
    if let keystoreManager = KeystoreManager.managerForPath(userDir + "/keystore") {
      if ((keystoreManager.addresses?.count)! > 0) {
        return try keystoreManager.UNSAFE_getPrivateKeyData(password: password, account: keystoreManager.addresses![0]).toHexString()
      }
    }
    
    return ""
  }
}

