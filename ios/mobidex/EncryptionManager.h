//
//  WalletManager.h
//  mobidex
//
//  Created by Abraham Elmahrek on 4/4/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef EncryptionManager_h
#define EncryptionManager_h

#import <React/RCTBridgeModule.h>

@interface EncryptionManager : NSObject <RCTBridgeModule>
- (NSData *)generateIV128;
- (NSData *)generateSalt256;
@end

#endif /* EncryptionManager_h */
