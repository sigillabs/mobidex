import {BigNumber} from '@uniswap/sdk';

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
export const ZERO = new BigNumber(0);
export const ONE = new BigNumber(1);
export const TEN = new BigNumber(10);
export const MAX_UINT256_HEX =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
export const UNLOCKED_AMOUNT = new BigNumber(2).pow(128).minus(1);
export const MAX_UINT256 = new BigNumber(2).pow(256).minus(1);

export * from './uniswap';
