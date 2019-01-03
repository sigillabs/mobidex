import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { BigNumber } from '0x.js';
import ethUtil from 'ethereumjs-util';
import moment from 'moment';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

String.prototype.format = function() {
  var i = 0,
    args = arguments;
  return this.replace(/{}/g, function() {
    return typeof args[i] != 'undefined' ? args[i++] : '';
  });
};

export function hex2a(hexx) {
  var hex = hexx.toString(); //force conversion
  var str = '';
  for (var i = 0; i < hex.length && hex.substr(i, 2) !== '00'; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

export function formatProduct(baseTokenSymbol, quoteTokenSymbol) {
  return `${baseTokenSymbol}-${quoteTokenSymbol}`;
}

export function formatSymbol(symbol) {
  if (!symbol) return symbol;
  const _symbol = symbol.toUpperCase().trim();
  return _symbol === 'WETH' ? 'ETH' : _symbol;
}

export function summarizeAddress(address) {
  if (!address) return address;
  if (typeof address !== 'string') return address;
  if (address.length < 12) return address;
  let addressWithoutPrefix = ethUtil.stripHexPrefix(address);
  let start = addressWithoutPrefix.substring(0, 4);
  let end = addressWithoutPrefix.substring(
    addressWithoutPrefix.length - 4,
    addressWithoutPrefix.length
  );
  return `0x${start}...${end}`;
}

export function formatTimestamp(timestamp) {
  return moment.unix(timestamp).format('MMMM Do YYYY, h:mm:ss a');
}

export function formatAmountWithDecimals(amount, decimals) {
  if (amount === null) return formatAmount(0);
  if (!decimals) return formatAmount(amount);
  return formatAmount(
    Web3Wrapper.toUnitAmount(new BigNumber(amount), decimals)
  );
}

export function formatAmount(amount) {
  if (amount === null) amount = 0;
  if (isDecimalOverflow(amount)) {
    amount = reduceDecimalOverflow(amount);
  }
  const amountBN = new BigNumber(amount);
  return amountBN.toFixed(6);
}

export function formatMoney(n) {
  const bn = new BigNumber(n.toString());
  return (
    (bn.lt(0) ? '-' : '') +
    '$' +
    zeroDecimalPad(Math.floor(bn.abs().toNumber() * 100) / 100, 2).toString()
  );
}

export function formatPercent(n) {
  return (Math.round(n * 10000) / 100).toString() + '%';
}

export function isDecimalOverflow(amount, decimals = 6) {
  if (!amount) return false;
  try {
    const stringAmount = new BigNumber(amount).toString();
    if (stringAmount.indexOf('.') === -1) return false;
    return stringAmount.length - stringAmount.indexOf('.') > decimals + 1;
  } catch (err) {
    return true;
  }
}

export function reduceDecimalOverflow(amount, decimals = 6) {
  if (!amount) return false;
  const stringAmount = amount.toString();
  const index = stringAmount.indexOf('.');
  if (index === -1) return stringAmount;
  return stringAmount.substring(0, index + decimals + 1);
}

export function zeroDecimalPad(n, d) {
  let str = n.toString();

  if (d <= 0) {
    return str;
  }

  let index = str.indexOf('.');

  if (index === -1) {
    str = `${str}.`;
    index = str.length - 1;
  }

  let existing = str.length - index - 1;

  if (d < existing) {
    return str;
  }

  while (d-- > existing) {
    str += '0';
  }

  return str;
}

export function colorWithAlpha(hex, alpha) {
  if (!/#?[a-fA-F0-9]{6}/.test(hex)) {
    return null;
  }
  if (hex.indexOf('#') === 0) {
    hex = hex.substring(1);
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function getForexIcon(symbol, extraProps = {}) {
  switch (symbol) {
    case 'USD':
      return <FontAwesome name="usd" {...extraProps} />;
  }
}

export function getImage(symbol) {
  switch (symbol) {
    case 'ABT':
      return require('../images/tokens/ABT.png');

    case 'AE':
      return require('../images/tokens/AE.png');

    case 'AGI':
      return require('../images/tokens/AGI.png');

    case 'AION':
      return require('../images/tokens/AION.png');

    case 'AIR':
      return require('../images/tokens/AIR.png');

    case 'AIX':
      return require('../images/tokens/AIX.png');

    case 'ANT':
      return require('../images/tokens/ANT.png');

    case 'ARN':
      return require('../images/tokens/ARN.png');

    case 'ART':
      return require('../images/tokens/ART.png');

    case 'AST':
      return require('../images/tokens/AST.png');

    case 'AUC':
      return require('../images/tokens/AUC.png');

    case 'BAT':
      return require('../images/tokens/BAT.png');

    case 'BAX':
      return require('../images/tokens/BAX.png');

    case 'BCDT':
      return require('../images/tokens/BCDT.png');

    case 'BEE':
      return require('../images/tokens/BEE.png');

    case 'BERRY':
      return require('../images/tokens/BERRY.png');

    case 'BLT':
      return require('../images/tokens/BLT.png');

    case 'BLZ':
      return require('../images/tokens/BLZ.png');

    case 'BNT':
      return require('../images/tokens/BNT.png');

    case 'BNTY':
      return require('../images/tokens/BNTY.png');

    case 'CAG':
      return require('../images/tokens/CAG.png');

    case 'CAN':
      return require('../images/tokens/CAN.png');

    case 'CAT':
      return require('../images/tokens/CAT.png');

    case 'CBT':
      return require('../images/tokens/CBT.png');

    case 'CDT':
      return require('../images/tokens/CDT.png');

    case 'CFI':
      return require('../images/tokens/CFI.png');

    case 'CL':
      return require('../images/tokens/CL.png');

    case 'CND':
      return require('../images/tokens/CND.png');

    case 'CRED':
      return require('../images/tokens/CRED.png');

    case 'CVC':
      return require('../images/tokens/CVC.png');

    case 'CVT':
      return require('../images/tokens/CVT.png');

    case 'DAI':
      return require('../images/tokens/DAI.png');

    case 'DALA':
      return require('../images/tokens/DALA.png');

    case 'DATA':
      return require('../images/tokens/DATA.png');

    case 'DCL':
      return require('../images/tokens/DCL.png');

    case 'DENT':
      return require('../images/tokens/DENT.png');

    case 'DFS':
      return require('../images/tokens/DFS.png');

    case 'DGD':
      return require('../images/tokens/DGD.png');

    case 'DGPT':
      return require('../images/tokens/DGPT.png');

    case 'DNT':
      return require('../images/tokens/DNT.png');

    case 'DOV':
      return require('../images/tokens/DOV.png');

    case 'DPP':
      return require('../images/tokens/DPP.png');

    case 'DRT':
      return require('../images/tokens/DRT.png');

    case 'DXT':
      return require('../images/tokens/DXT.png');

    case 'EBTC':
      return require('../images/tokens/EBTC.png');

    case 'ELF':
      return require('../images/tokens/ELF.png');

    case 'EMONT':
      return require('../images/tokens/EMONT.png');

    case 'ENO':
      return require('../images/tokens/ENO.png');

    case 'ENTRP':
      return require('../images/tokens/ENTRP.png');

    case 'ETH':
      return require('../images/tokens/ETH.png');

    case 'ETHOS':
      return require('../images/tokens/ETHOS.png');

    case 'EUSD':
      return require('../images/tokens/EUSD.png');

    case 'EVC':
      return require('../images/tokens/EVC.png');

    case 'EVE':
      return require('../images/tokens/EVE.png');

    case 'FDX':
      return require('../images/tokens/FDX.png');

    case 'FLIP':
      return require('../images/tokens/FLIP.png');

    case 'FLLW':
      return require('../images/tokens/FLLW.png');

    case 'FND':
      return require('../images/tokens/FND.png');

    case 'FUEL':
      return require('../images/tokens/FUEL.png');

    case 'FUN':
      return require('../images/tokens/FUN.png');

    case 'FYN':
      return require('../images/tokens/FYN.png');

    case 'GET':
      return require('../images/tokens/GET.png');

    case 'GNO':
      return require('../images/tokens/GNO.png');

    case 'GNT':
      return require('../images/tokens/GNT.png');

    case 'GOAL':
      return require('../images/tokens/GOAL.png');

    case 'GOLDX':
      return require('../images/tokens/GOLDX.png');

    case 'GRID':
      return require('../images/tokens/GRID.png');

    case 'GUP':
      return require('../images/tokens/GUP.png');

    case 'HAV':
      return require('../images/tokens/HAV.png');

    case 'HGT':
      return require('../images/tokens/HGT.png');

    case 'HIRE':
      return require('../images/tokens/HIRE.png');

    case 'HST':
      return require('../images/tokens/HST.png');

    case 'ICX':
      return require('../images/tokens/ICX.png');

    case 'IFT':
      return require('../images/tokens/IFT.png');

    case 'INS':
      return require('../images/tokens/INS.png');

    case 'INXT':
      return require('../images/tokens/INXT.png');

    case 'IOST':
      return require('../images/tokens/IOST.png');

    case 'JNT':
      return require('../images/tokens/JNT.png');

    case 'KICK':
      return require('../images/tokens/KICK.png');

    case 'KNC':
      return require('../images/tokens/KNC.png');

    case 'LEND':
      return require('../images/tokens/LEND.png');

    case 'LINK':
      return require('../images/tokens/LINK.png');

    case 'LNK':
      return require('../images/tokens/LNK.png');

    case 'LOC':
      return require('../images/tokens/LOC.png');

    case 'LOOM':
      return require('../images/tokens/LOOM.png');

    case 'MANA':
      return require('../images/tokens/MANA.png');

    case 'MBRS':
      return require('../images/tokens/MBRS.png');

    case 'MKR':
      return require('../images/tokens/MKR.png');

    case 'MLN':
      return require('../images/tokens/MLN.png');

    case 'MTL':
      return require('../images/tokens/MTL.png');

    case 'MWAT':
      return require('../images/tokens/MWAT.png');

    case 'NEWB':
      return require('../images/tokens/NEWB.png');

    case 'NMR':
      return require('../images/tokens/NMR.png');

    case 'NVT':
      return require('../images/tokens/NVT.png');

    case 'OMG':
      return require('../images/tokens/OMG.png');

    case 'PCL':
      return require('../images/tokens/PCL.png');

    case 'PLU':
      return require('../images/tokens/PLU.png');

    case 'POE':
      return require('../images/tokens/POE.png');

    case 'POLY':
      return require('../images/tokens/POLY.png');

    case 'POW':
      return require('../images/tokens/POW.png');

    case 'POWR':
      return require('../images/tokens/POWR.png');

    case 'PTOY':
      return require('../images/tokens/PTOY.png');

    case 'QSP':
      return require('../images/tokens/QSP.png');

    case 'QVT':
      return require('../images/tokens/QVT.png');

    case 'RCN':
      return require('../images/tokens/RCN.png');

    case 'RDN':
      return require('../images/tokens/RDN.png');

    case 'REAL':
      return require('../images/tokens/REAL.png');

    case 'REN':
      return require('../images/tokens/REN.png');

    case 'REP':
      return require('../images/tokens/REP.png');

    case 'REQ':
      return require('../images/tokens/REQ.png');

    case 'RHOC':
      return require('../images/tokens/RHOC.png');

    case 'RKT':
      return require('../images/tokens/RKT.png');

    case 'RLC':
      return require('../images/tokens/RLC.png');

    case 'RVT':
      return require('../images/tokens/RVT.png');

    case 'SALT':
      return require('../images/tokens/SALT.png');

    case 'SHP':
      return require('../images/tokens/SHP.png');

    case 'SNIP':
      return require('../images/tokens/SNIP.png');

    case 'SNM':
      return require('../images/tokens/SNM.png');

    case 'SNOV':
      return require('../images/tokens/SNOV.png');

    case 'SNT':
      return require('../images/tokens/SNT.png');

    case 'SPANK':
      return require('../images/tokens/SPANK.png');

    case 'STAC':
      return require('../images/tokens/STAC.png');

    case 'STORJ':
      return require('../images/tokens/STORJ.png');

    case 'STORM':
      return require('../images/tokens/STORM.png');

    case 'STU':
      return require('../images/tokens/STU.png');

    case 'SUB':
      return require('../images/tokens/SUB.png');

    case 'TAU':
      return require('../images/tokens/TAU.png');

    case 'THETA':
      return require('../images/tokens/THETA.png');

    case 'TIX':
      return require('../images/tokens/TIX.png');

    case 'TUSD':
      return require('../images/tokens/TUSD.png');

    case 'UFR':
      return require('../images/tokens/UFR.png');

    case 'UKG':
      return require('../images/tokens/UKG.png');

    case 'VEE':
      return require('../images/tokens/VEE.png');

    case 'VIT':
      return require('../images/tokens/VIT.png');

    case 'WAND':
      return require('../images/tokens/WAND.png');

    case 'WAX':
      return require('../images/tokens/WAX.png');

    case 'WETH':
      return require('../images/tokens/WETH.png');

    case 'WLK':
      return require('../images/tokens/WLK.png');

    case 'WYS':
      return require('../images/tokens/WYS.png');

    case 'XAUR':
      return require('../images/tokens/XAUR.png');

    case 'XGM':
      return require('../images/tokens/XGM.png');

    case 'XRL':
      return require('../images/tokens/XRL.png');

    case 'XSC':
      return require('../images/tokens/XSC.png');

    case 'ZAP':
      return require('../images/tokens/ZAP.png');

    case 'ZAPIT':
      return require('../images/tokens/ZAPIT.png');

    case 'ZIL':
      return require('../images/tokens/ZIL.png');

    case 'ZRX':
      return require('../images/tokens/ZRX.png');

    default:
      return require('../images/tokens/WETH.png');
  }
}

export function processVirtualKeyboardCharacter(character, stringOrArray) {
  const isString = typeof stringOrArray === 'string';
  const array = isString ? stringOrArray.split('') : stringOrArray.slice();

  if (isNaN(character)) {
    if (character === 'back') {
      array.pop();
    } else if (character === '.' && !~array.indexOf('.')) {
      array.push(character);
    }
  } else {
    array.push(character);
  }

  if (isString) {
    return array.join('');
  } else {
    return array;
  }
}

export function isValidAmount(amount) {
  return /^\d*(\.\d*)?$/.test(amount);
}
