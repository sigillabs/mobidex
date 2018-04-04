//
//  Encrypt.h
//  mobidex
//
//  Created by Abraham Elmahrek on 4/4/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef Encrypt_h
#define Encrypt_h

@interface NSData (Encryption)
- (NSData *)AES128CTREncryptWithKey:(NSData *)key iv:(NSData *)iv;
- (NSData *)AES128CTRDecryptWithKey:(NSData *)key iv:(NSData *)iv;
@end

#endif /* Encrypt_h */
