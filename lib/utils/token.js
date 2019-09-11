import { BigNumber } from '@uniswap/sdk';

export function toUnitAmount(amount, decimals = 18) {
  return new BigNumber(amount);
}

export function toBaseUnitAmount(amount, decimals = 18) {
  return new BigNumber(amount);
}
