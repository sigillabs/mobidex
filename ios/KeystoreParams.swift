
//
//  BIP32KeystoreJSONStructure.swift
//  web3swift
//
//  Created by Alexander Vlasov on 11.01.2018.
//  Copyright © 2018 Bankex Foundation. All rights reserved.
//
import Foundation

public struct KeystoreParamsBIP32: Decodable, Encodable {
  var encryptedKey: Data
  var id: String?
  var version: Int = 32
  var isHDWallet: Bool
  var path: String?
  
  public init(encryptedKey ek: Data, id i: String, version ver: Int, path p: String? = nil) {
    encryptedKey = ek
    id = i
    version = ver
    isHDWallet = true
    path = p
  }
}
