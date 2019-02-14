import ethUtil from 'ethereumjs-util';

export function formatHexString(hs, lowercase = true) {
  if (lowercase) {
    hs = hs.toLowerCase();
  }
  return `0x${ethUtil.stripHexPrefix(hs)}`;
}
