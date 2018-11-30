//
//  WalletManagerBridge.m
//  mobidex
//
//  Created by Abraham Elmahrek on 6/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WalletManager, NSObject)

RCT_EXTERN_METHOD(supportsFingerPrintAuthentication:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(cancelFingerPrintAuthentication:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(generateMnemonics:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(importWalletByMnemonics:(NSString *)mnemonic password:(NSString *)password callback:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(loadWallet:(NSString *)password callback:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(loadWalletAddress:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(signTransaction:(NSDictionary *)tx password:(NSString *)password callback:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(signMessage:(NSString *)message password:(NSString *)password callback:(RCTResponseSenderBlock)callback)

@end
