//
//  WalletManagerBridge.m
//  mobidex
//
//  Created by Abraham Elmahrek on 6/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BitskiManager, NSObject)

RCT_EXTERN_METHOD(initialize:(NSString *)network clientID:(NSString *)clientID redirectURL:(NSString *)redirectURL callback:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(isWalletAvailable:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(loadWalletAddress:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(signTransaction:(NSDictionary *)tx callback:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(signMessage:(NSString *)message callback:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(login:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(logout:(RCTResponseSenderBlock)callback)

@end
