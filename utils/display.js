import ethUtil from "ethereumjs-util";

export function summarizeAddress(address) {
  if (!address) return address;
  if (typeof address !== "string") return address;
  if (address.length < 12) return address;
  let addressWithoutPrefix = ethUtil.stripHexPrefix(address);
  let start = addressWithoutPrefix.substring(0, 4);
  let end = addressWithoutPrefix.substring(addressWithoutPrefix.length - 4, addressWithoutPrefix.length);
  return `0x${start}...${end}`;
}