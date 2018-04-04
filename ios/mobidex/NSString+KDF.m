//
//  KDF.m
//  mobidex
//
//  Created by Abraham Elmahrek on 4/5/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CommonCrypto/CommonKeyDerivation.h>
#import <React/RCTLog.h>
#import "NSString+KDF.h"

@implementation NSString (KDF)

- (NSData *)AES128CTRDeriveKey:(NSData *)salt {
  const char * p = [self cStringUsingEncoding:NSASCIIStringEncoding];
  
  void *key = malloc(64);
  CCKeyDerivationPBKDF(kCCPBKDF2, p, self.length, salt.bytes, salt.length, kCCPRFHmacAlgSHA256, 262144, key, 32);
  return [NSData dataWithBytesNoCopy:key length:64];
}

@end
