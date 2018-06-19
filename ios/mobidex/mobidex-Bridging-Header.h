//
//  WalletManagerBridge.m
//  mobidex
//
//  Created by Abraham Elmahrek on 4/4/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WalletManager, NSObject)

RCT_EXTERN_METHOD(generateMnemonic)
RCT_EXTERN_METHOD(importWalletByMnemonics:(NSString *)mnemonics password:(NSString *)password)
RCT_EXTERN_METHOD(loadWallet:(NSString *)password)

@end
