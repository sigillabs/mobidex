//
//  Encrypt.m
//  mobidex
//
//  Created by Abraham Elmahrek on 4/4/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CommonCrypto/CommonCryptor.h>
#import <CommonCrypto/CommonKeyDerivation.h>
#import <React/RCTLog.h>
#import "NSData+Encrypt.h"

@implementation NSData (Encryption)

- (NSData *)AES128CTREncryptWithKey:(NSData *)key iv:(NSData *)iv {
  // 'iv' should be 16 bytes for AES128
  char ivPtr[kCCBlockSizeAES128+1]; // room for terminator (unused)
  bzero(ivPtr, sizeof(ivPtr)); // fill with zeroes (for padding)
  memcpy(ivPtr, [iv bytes], kCCBlockSizeAES128);

  // 'key' should be 32 bytes for AES128
  char keyPtr[kCCKeySizeAES128+1]; // room for terminator (unused)
  bzero(keyPtr, sizeof(keyPtr)); // fill with zeroes (for padding)
  memcpy(keyPtr, [key bytes], kCCKeySizeAES128);
  
  NSUInteger dataLength = [self length];
  
  //See the doc: For block ciphers, the output size will always be less than or
  //equal to the input size plus the size of one block.
  //That's why we need to add the size of one block here
  size_t bufferSize = dataLength + kCCBlockSizeAES128;
  void *buffer = malloc(bufferSize);
  
  size_t updateNumBytesEncrypted = 0, finalNumBytesEncrypted = 0, numBytesEncrypted = 0;
  CCCryptorRef cryptorRef;

  CCCryptorStatus cryptStatus = CCCryptorCreateWithMode(kCCEncrypt, kCCModeCTR,
                                                        kCCAlgorithmAES128, ccNoPadding,
                                                        ivPtr, keyPtr, kCCKeySizeAES128,
                                                        NULL, 0, /* Tweak */
                                                        0, /* Num Rounds (0 = default) */
                                                        kCCModeOptionCTR_BE, /* Options */
                                                        &cryptorRef);
  if (cryptStatus != kCCSuccess) {
    RCTLogWarn(@"Could not create cryptor with error %d.", cryptStatus);
    free(buffer);
    return nil;
  }

  cryptStatus = CCCryptorUpdate(cryptorRef,
                                [self bytes], dataLength, /* input */
                                buffer, bufferSize,       /* output */
                                &updateNumBytesEncrypted);
  
  if (cryptStatus != kCCSuccess) {
    RCTLogWarn(@"Could not update cryptor with error %d.", cryptStatus);
    free(buffer);
    return nil;
  }

  cryptStatus = CCCryptorFinal(cryptorRef,
                                 buffer, bufferSize,       /* output */
                                 &finalNumBytesEncrypted);

  if (cryptStatus != kCCSuccess) {
    RCTLogWarn(@"Could not finalize cryptor with error %d.", cryptStatus);
    free(buffer);
    return nil;
  }
  
  numBytesEncrypted = updateNumBytesEncrypted + finalNumBytesEncrypted;
  
  //the returned NSData takes ownership of the buffer and will free it on deallocation
  // return [NSData dataWithBytesNoCopy:buffer length:numBytesEncrypted];
  return [NSData dataWithBytesNoCopy:buffer length:numBytesEncrypted];
}

- (NSData *)AES128CTRDecryptWithKey:(NSData *)key iv:(NSData *)iv {
  // 'iv' should be 16 bytes for AES128
  char ivPtr[kCCBlockSizeAES128+1]; // room for terminator (unused)
  bzero(ivPtr, sizeof(ivPtr)); // fill with zeroes (for padding)
  memcpy(ivPtr, [iv bytes], kCCBlockSizeAES128);

  // 'key' should be 32 bytes for AES128
  char keyPtr[kCCKeySizeAES128+1]; // room for terminator (unused)
  bzero(keyPtr, sizeof(keyPtr)); // fill with zeroes (for padding)
  memcpy(keyPtr, [key bytes], kCCKeySizeAES128);

  NSUInteger dataLength = [self length];

  //See the doc: For block ciphers, the output size will always be less than or
  //equal to the input size plus the size of one block.
  //That's why we need to add the size of one block here
  size_t bufferSize = dataLength + kCCBlockSizeAES128;
  void *buffer = malloc(bufferSize);

  size_t updateNumBytesDecrypted = 0, finalNumBytesDecrypted = 0, numBytesDecrypted = 0;
  CCCryptorRef cryptorRef;

  CCCryptorStatus cryptStatus = CCCryptorCreateWithMode(kCCDecrypt, kCCModeCTR,
                                                        kCCAlgorithmAES128, ccNoPadding,
                                                        ivPtr, keyPtr, kCCKeySizeAES128,
                                                        NULL, 0, /* Tweak */
                                                        0, /* Num Rounds (0 = default) */
                                                        kCCModeOptionCTR_BE, /* Options */
                                                        &cryptorRef);
  if (cryptStatus != kCCSuccess) {
    free(buffer);
    return nil;
  }
  
  cryptStatus = CCCryptorUpdate(cryptorRef,
                                [self bytes], dataLength, /* input */
                                buffer, bufferSize,       /* output */
                                &updateNumBytesDecrypted);
  
  if (cryptStatus != kCCSuccess) {
    free(buffer);
    return nil;
  }
  
  cryptStatus = CCCryptorFinal(cryptorRef,
                               buffer, bufferSize,       /* output */
                               &finalNumBytesDecrypted);

  if (cryptStatus != kCCSuccess) {
    free(buffer);
    return nil;
  }
  
  numBytesDecrypted = updateNumBytesDecrypted + finalNumBytesDecrypted;
  
  //the returned NSData takes ownership of the buffer and will free it on deallocation
  return [NSData dataWithBytesNoCopy:buffer length:numBytesDecrypted];
}

@end
