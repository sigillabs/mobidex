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

struct BitskiManagerError: Error {
  let message: String
  
  init(message: String) {
    self.message = message
  }
}

@objc(BitskiManager)
class BitskiManager: NSObject {
  private var network: Bitski.Network? = nil;
  
  @objc(initialize:clientID:redirectURL:callback:) func initialize(network: String, clientID: String, redirectURL: String, callback: @escaping RCTResponseSenderBlock) -> Void {
    switch(network) {
    case "mainnet":
      self.network = Bitski.Network.mainnet
      break;
    case "kovan":
      self.network = Bitski.Network.kovan
      break;
    default:
      self.network = Bitski.Network.mainnet
      break;
    }
    
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
    
    let web3 = bitski.getWeb3(network: self.network!)
    let data = EthereumData(bytes: hexToPaddedData(message).bytes)
    
    firstly {
      web3.eth.accounts().firstValue
    }.then { account in
      web3.eth.sign(address: account, data: data)
    }.done { signature in
      callback([NSNull(), signature.hex()])
    }.catch { error in
      callback([error.localizedDescription, NSNull()])
    }
  }
  
  @objc(sendTransaction:callback:) func sendTransaction(tx: NSDictionary, callback: @escaping RCTResponseSenderBlock) -> Void {
    if (tx.object(forKey: "gasPrice") == nil) {
      tx.setValue("0x1", forKey: "gasPrice")
    }
    
    guard let to: EthereumAddress = EthereumAddress(hexString: tx["to"] as! String) else {
      callback(["`to` address is malformed.", NSNull()])
      return;
    }

    let gas: EthereumQuantity = EthereumQuantity(quantity: hexToPaddedBigUInt(tx["gas"] as! String))
    let gasPrice: EthereumQuantity = EthereumQuantity(quantity: hexToPaddedBigUInt(tx["gasPrice"] as! String))

    var value: EthereumQuantity? = nil
    if tx.object(forKey: "value") != nil {
      print("value")
      value = EthereumQuantity(quantity: hexToPaddedBigUInt(tx["value"] as! String))
    }

    var data: EthereumData = EthereumData(bytes: [])
    if tx.object(forKey: "data") != nil {
      data = EthereumData(bytes: hexToPaddedData(tx["data"] as! String).bytes)
    }

    guard let bitski = Bitski.shared else {
      callback(["Bitski not instantiated", NSNull()])
      return;
    }
    
    let web3 = bitski.getWeb3(network: self.network!)
    
    firstly {
      web3.eth.accounts().firstValue
    }.done { account in
      firstly {
        web3.eth.getTransactionCount(address: account, block: .latest)
      }.then { nonce -> Promise<EthereumData> in
        let transaction = EthereumTransaction(nonce: nonce, gasPrice: gasPrice, gas: gas, from: account, to: to, value: value, data: data)
        return web3.eth.sendTransaction(transaction: transaction)
      }.done { transactionHash in
        callback([NSNull(), transactionHash.hex()])
      }.catch { error in
        callback([error.localizedDescription, NSNull()])
      }
    }.catch { error in
      callback([error.localizedDescription, NSNull()])
    }
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
