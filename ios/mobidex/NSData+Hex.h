//
//  NSData+Hex.h
//  mobidex
//
//  Created by Abraham Elmahrek on 4/5/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef NSData_Hex_h
#define NSData_Hex_h

#import <Foundation/Foundation.h>

@interface NSData (Hex)

- (NSString*)hexString;
- (NSString*)hexStringWithCaps:(BOOL)caps;
+ (NSData*)dataWithHexString:(NSString*)hexString;

@end

#endif /* NSData_Hex_h */
