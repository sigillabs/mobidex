//
//  NSData+Hex.m
//  mobidex
//
//  Created by Abraham Elmahrek on 4/5/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "NSData+Hex.h"

@implementation NSData (Hex)

- (NSString*)hexString
{
  return [self hexStringWithCaps:NO];
}

- (NSString*)hexStringWithCaps:(BOOL)caps
{
  const char *hex = caps ? "01234567890ABCDEF" : "0123456789abcdef";
  char *hexString = malloc(self.length*2);
  const uint8_t *bytes = self.bytes;
  for (size_t i = 0; i < self.length; i++)
  {
    hexString[2*i] = hex[(bytes[i] & 0xF0) >> 4];
    hexString[2*i+1] = hex[bytes[i] & 0x0F];
  }
  return [[NSString alloc] initWithBytesNoCopy:hexString length:self.length*2 encoding:NSASCIIStringEncoding freeWhenDone:YES];
}

+ (NSData*)dataWithHexString:(NSString*)hexString
{
  if (hexString == nil)
    return nil;
  hexString = [hexString stringByReplacingOccurrencesOfString:@"[^0-9a-f]" withString:@"" options:NSRegularExpressionSearch|NSCaseInsensitiveSearch range:NSMakeRange(0, hexString.length)];
  if (hexString.length % 2 != 0)
    return nil;
  uint8_t * const buf = malloc(hexString.length/2);
  uint8_t *wbuf = buf;
  const char *str = hexString.UTF8String;
  char hexchar[3] = "00";
  while (*str)
  {
    hexchar[0] = *str++;
    hexchar[1] = *str++;
    *wbuf = (uint8_t)strtol(hexchar, NULL, 16);
    wbuf++;
  }
  return [NSData dataWithBytesNoCopy:buf length:hexString.length/2 freeWhenDone:YES];
}

@end
