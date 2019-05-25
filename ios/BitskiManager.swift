//
//  BitskiManager.swift
//  mobidex
//
//  Created by Abraham Elmahrek on 5/23/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import Bitski

@objc(BitskiManager)
class BitskiManager: NSObject {
  private var attrKeyTypeEllipticCurve: String {
    if #available(iOS 10.0, *) {
      return kSecAttrKeyTypeECSECPrimeRandom as String
    } else {
      return kSecAttrKeyTypeEC as String
    }
  }
  
  func initialize(clientID: string, redirectURL: string) -> Boolean {
    Bitski.shared = Bitski(clientID: clientID, redirectURL: URL(redirectURL)!)
  }
  
  func initialized() -> String {
    return Bitski.shared?.isLoggedIn
  }
}

