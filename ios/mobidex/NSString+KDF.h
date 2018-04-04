//
//  KDF.h
//  mobidex
//
//  Created by Abraham Elmahrek on 4/5/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef KDF_h
#define KDF_h

@interface NSString (KDF)
- (NSData *)AES128CTRDeriveKey:(NSData *)salt;
@end

#endif /* KDF_h */
