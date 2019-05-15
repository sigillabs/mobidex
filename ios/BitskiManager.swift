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
  private var network: Bitski.Network? = nil;
  
  @objc(initialize:clientID:redirectURL:callback:) func initialize(network: String, clientID: String, redirectURL: String, callback: @escaping RCTResponseSenderBlock) -> Void {
    self.network = Bitski.Network.init(rawValue: network)
    
    Bitski.shared = Bitski(clientID: clientID, redirectURL: URL(string: redirectURL)!)

    callback([NSNull(), NSNull()])
  }
  
  @objc(isWalletAvailable:) func isWalletAvailable(callback: @escaping RCTResponseSenderBlock) -> Void {
    guard let bitski = Bitski.shared else {
      callback(["Bitski not instantiated", NSNull()])
      return;
    }

    callback([NSNull(), bitski.isLoggedIn])
  }

  @objc(loadWalletAddress:) func loadWalletAddress(callback: @escaping RCTResponseSenderBlock) -> Void {
    guard let bitski = Bitski.shared else {
      callback(["Bitski not instantiated", NSNull()])
      return;
    }

    guard let addresses =  try? bitski.getWeb3(network: self.network!).eth.accounts().wait(),
      addresses.count > 0 else {
        callback([NSNull(), NSNull()])
        return;
    }

    callback([NSNull(), addresses[0].hex(eip55: false)])
    return;
  }

  @objc(signMessage:callback:) func signMessage(message: String, callback: @escaping RCTResponseSenderBlock) -> Void {
    guard let bitski = Bitski.shared else {
      callback(["Bitski not instantiated", NSNull()])
      return;
    }

    guard let waited =  try? Bitski.shared?.getWeb3(network: self.network!).eth.accounts().wait(),
      let addresses = waited,
      addresses.count > 0 else {
        callback(["Not logged in.", NSNull()])
        return;
    }
    let address = addresses[0]
    let data = EthereumData(bytes: Bytes.init(hexString: message as! String)!)
    let response = try? bitski.getWeb3(network: self.network!).eth.sign(address: address, data: data).wait()
    
    callback([NSNull(), response?.hex()])
  }
  
  @objc(signTransaction:callback:) func signTransaction(tx: NSDictionary, callback: @escaping RCTResponseSenderBlock) -> Void {
    guard let bitski = Bitski.shared else {
      callback(["Bitski not instantiated", NSNull()])
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
      if let bytes = Bytes.init(hexString: tx["data"] as! String) {
        data = EthereumData(bytes: bytes)
      }
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
    let response = try? bitski.getWeb3(network: self.network!).eth.sendTransaction(transaction: tx).wait()

    callback([NSNull(), response?.hex()])
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
  }
  
  @objc(logout:) func logout(callback: @escaping RCTResponseSenderBlock) -> Void {
    if Bitski.shared?.isLoggedIn == false {
      callback([NSNull(), true])
      return;
    }
    
    Bitski.shared?.signOut()
    
    callback([NSNull(), true])
  }
}
