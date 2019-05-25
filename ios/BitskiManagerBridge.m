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

RCT_EXTERN_METHOD(initialize:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(initialized:(RCTResponseSenderBlock)callback)

@end
