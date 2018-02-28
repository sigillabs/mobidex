import BigNumber from "bignumber.js";
import ethUtil from "ethereumjs-util";
import { ZeroEx } from "0x.js";

export function summarizeAddress(address) {
  if (!address) return address;
  if (typeof address !== "string") return address;
  if (address.length < 12) return address;
  let addressWithoutPrefix = ethUtil.stripHexPrefix(address);
  let start = addressWithoutPrefix.substring(0, 4);
  let end = addressWithoutPrefix.substring(addressWithoutPrefix.length - 4, addressWithoutPrefix.length);
  return `0x${start}...${end}`;
}

export function formatAmountWithDecimals(amount, decimals) {
  if (amount === null) return formatAmount(0);
  if (!decimals) return formatAmount(amount);
  return formatAmount(ZeroEx.toUnitAmount(new BigNumber(amount), decimals));
}

export function formatAmount(amount) {
  return new BigNumber(amount).toFixed(4);
}