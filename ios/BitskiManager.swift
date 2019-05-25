//
//  BitskiManager.swift
//  mobidex
//
//  Created by Abraham Elmahrek on 5/23/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import Bitski
import Web3

@objc(BitskiManager)
class BitskiManager: NSObject {
  private var attrKeyTypeEllipticCurve: String {
    if #available(iOS 10.0, *) {
      return kSecAttrKeyTypeECSECPrimeRandom as String
    } else {
      return kSecAttrKeyTypeEC as String
    }
  }
  
  @objc(initialize:redirectURL:callback:) func initialize(clientID: String, redirectURL: String, callback: @escaping RCTResponseSenderBlock) -> Void {
    Bitski.shared = Bitski(clientID: clientID, redirectURL: URL(string: redirectURL)!)

    callback([NSNull(), NSNull()])
  }
  
  @objc(isWalletAvailable:) func isWalletAvailable(callback: @escaping RCTResponseSenderBlock) -> Void {
    guard let bitski = Bitski.shared else {
        callback([NSNull(), false])
        return;
    }

    callback([NSNull(), bitski.isLoggedIn])
  }

  @objc(loadWalletAddress:) func loadWalletAddress(callback: @escaping RCTResponseSenderBlock) -> Void {
    guard let waited =  try? Bitski.shared?.getWeb3().eth.accounts().wait(),
      let addresses = waited,
      addresses.count > 0 else {
        callback([NSNull(), NSNull()])
        return;
    }

    callback([NSNull(), addresses[0].hex(eip55: false)])
    return;
  }

  @objc(signMessage:password:callback:) func signMessage(message: String, password: String?, callback: @escaping RCTResponseSenderBlock) -> Void {
    guard let bitski = Bitski.shared else {
      callback([NSNull(), NSNull()])
      return;
    }
    
    // TODO
  }
  
  @objc(signTransaction:callback:) func signTransaction(tx: NSDictionary, callback: @escaping RCTResponseSenderBlock) -> Void {
    guard let bitski = Bitski.shared else {
      callback([NSNull(), NSNull()])
      return;
    }

    let nonce: EthereumQuantity? = EthereumQuantity(quantity: hexToPaddedBigUInt(tx["nonce"] as! String))
    let to: EthereumAddress = EthereumAddress(hexString: tx["to"] as! String)!
    var gas: EthereumQuantity? = nil
    var gasPrice: EthereumQuantity? = nil
    var value: EthereumQuantity? = nil
    var from: EthereumAddress? = nil
    var data: EthereumData = EthereumData(bytes: Bytes.init())

    if (tx.object(forKey: "data") != nil) {
      data = EthereumData(bytes: Bytes.init(hexString: tx["data"] as! String)!)
    }

    if (tx.object(forKey: "from") != nil) {
      from = EthereumAddress(hexString: tx["from"] as! String)
    }
    
    if (tx.object(forKey: "gas") != nil) {
      gas = EthereumQuantity(quantity: hexToPaddedBigUInt(tx["gas"] as! String))
    }
    
    if (tx.object(forKey: "gasPrice") != nil) {
      gasPrice = EthereumQuantity(quantity: hexToPaddedBigUInt(tx["gasPrice"] as! String))
    }
    
    if (tx.object(forKey: "value") != nil) {
      value = EthereumQuantity(quantity: hexToPaddedBigUInt(tx["value"] as! String))
    } else {
      value = EthereumQuantity(quantity: hexToPaddedBigUInt("0x0"))
    }

    let tx = EthereumTransaction(nonce: nonce, gasPrice: gasPrice, gas: gas, from: from, to: to, value: value, data: data)

    bitski.getWeb3().eth.sendTransaction(transaction: tx).result
  }

  @objc(login:) func login(callback: @escaping RCTResponseSenderBlock) -> Void {
    if Bitski.shared?.isLoggedIn == true {
      callback([NSNull(), true])
      return;
    }

    Bitski.shared?.signIn() { error in
      callback([error?.localizedDescription, Bitski.shared?.isLoggedIn])
      return
    }
    
    callback([NSNull(), Bitski.shared?.isLoggedIn])
    print(Bitski.shared)
  }
}
