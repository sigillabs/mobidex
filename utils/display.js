import { ZeroEx } from "0x.js";
import BigNumber from "bignumber.js";
import ethUtil from "ethereumjs-util";
import moment from "moment";

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

export function getImage(symbol) {
  switch(symbol) {
  case "ETH":
    return require("../images/logos/ETH.png");

  case "ZRX":
    return require("../images/logos/ZRX.png");

  case "MLN":
    return require("../images/logos/MLN.png");

  case "MKR":
    return require("../images/logos/MKR.png");

  case "DGD":
    return require("../images/logos/DGD.png");

  case "REP":
    return require("../images/logos/REP.png");

  case "GNT":
    return require("../images/logos/GNT.png");

  default:
    return require("../images/logos/WETH.png");
  }
}

export function formatTimestamp(timestamp) {
  return moment.unix(timestamp).format("MMMM Do YYYY, h:mm:ss a");
}
