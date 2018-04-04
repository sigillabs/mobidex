//
//  WalletManager.m
//  mobidex
//
//  Created by Abraham Elmahrek on 4/4/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CommonCrypto/CommonDigest.h>
#import <CommonCrypto/CommonCryptor.h>
#import <React/RCTLog.h>
#import "NSData+Encrypt.h"
#import "NSData+Hex.h"
#import "NSString+KDF.h"
#import "EncryptionManager.h"

@implementation EncryptionManager

// To export a module named WalletManager
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(encrypt:(NSString *)text password:(NSString *)password iv:(NSString *)iv salt:(NSString *)salt callback:(RCTResponseSenderBlock)callback)
{
  NSData * _salt = [NSData dataWithHexString:salt];
  NSData * _iv = [NSData dataWithHexString:iv];
  NSData * key = [password AES128CTRDeriveKey:_salt];
  NSData * data = [NSData dataWithHexString:text];
  
  NSData * ciphertext = [data AES128CTREncryptWithKey:key iv:_iv];
  RCTLogTrace(@"Encrypted text %@", ciphertext);
  
  NSString * result = [ciphertext hexString];
  callback(@[[NSNull null], result]);
}

RCT_EXPORT_METHOD(decrypt:(NSString *)ciphertext password:(NSString *)password iv:(NSString *)iv salt:(NSString *)salt callback:(RCTResponseSenderBlock)callback)
{
  NSData * _salt = [NSData dataWithHexString:salt];
  NSData * _iv = [NSData dataWithHexString:iv];
  NSData * _ciphertext = [NSData dataWithHexString:ciphertext];
  NSData * key = [password AES128CTRDeriveKey:_salt];
  
  NSData * text = [_ciphertext AES128CTRDecryptWithKey:key iv:_iv];
  RCTLogTrace(@"Decrypted text %@", text);
  
  NSString * result = [text hexString];
  callback(@[[NSNull null], result]);
}

RCT_EXPORT_METHOD(generateIV:(RCTResponseSenderBlock)callback)
{
  NSData * iv = [self generateIV128];
  RCTLogTrace(@"Generated Salt %@", iv);
  
  NSString * result = [iv hexString];
  callback(@[[NSNull null], result]);
}

RCT_EXPORT_METHOD(generateSalt:(RCTResponseSenderBlock)callback)
{
  NSData * salt = [self generateSalt256];
  RCTLogTrace(@"Generated Salt %@", salt);
  
  NSString * result = [salt hexString];
  callback(@[[NSNull null], result]);
}

- (NSData *)generateIV128 {
  unsigned char iv[16];
  for (int i=0; i<16; i++) {
    iv[i] = (unsigned char)arc4random();
  }
  return [NSData dataWithBytes:iv length:16];
}

- (NSData *)generateSalt256 {
  unsigned char salt[32];
  for (int i=0; i<32; i++) {
    salt[i] = (unsigned char)arc4random();
  }
  return [NSData dataWithBytes:salt length:32];
}

@end
