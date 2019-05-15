//
//  Web3+Sign.swift
//  mobidex
//
//  Created by Abraham Elmahrek on 6/6/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import Web3

extension Web3.Eth {
  public func sign(
    address: EthereumAddress,
    data: EthereumData,
    response: @escaping Web3.Web3ResponseCompletion<EthereumData>
    ) {
    let req = BasicRPCRequest(
      id: properties.rpcId,
      jsonrpc: Web3.jsonrpc,
      method: "eth_sign",
      params: [address, data]
    )
    properties.provider.send(request: req, response: response)
  }
  
  public func sign(address: EthereumAddress, data: EthereumData) -> Promise<EthereumData> {
    return Promise { seal in
      self.sign(address: address, data: data) { response in
        seal.resolve(response.result, response.error)
      }
    }
  }
}
