import { BigNumber } from '0x.js';
import ethUtil from 'ethereumjs-util';

export function formatHexString(hs, lowercase = true) {
  if (lowercase) {
    hs = hs.toLowerCase();
  }
  return `0x${ethUtil.stripHexPrefix(hs)}`;
}

export function formatUnitValue(value, decimals = 18) {
  const fixed = new BigNumber(value.toString()).toFixed(decimals);
  return new BigNumber(fixed);
}
