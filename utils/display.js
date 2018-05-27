import { ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import ethUtil from 'ethereumjs-util';
import moment from 'moment';

BigNumber.set({ DECIMAL_PLACES: 77, ERRORS: false });

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

export function formatAmountWithDecimals(amount, decimals) {
  if (amount === null) return formatAmount(0);
  if (!decimals) return formatAmount(amount);
  return formatAmount(ZeroEx.toUnitAmount(new BigNumber(amount), decimals));
}

export function formatAmount(amount) {
  return new BigNumber(amount).toFixed(6);
}

export function getImage(symbol) {
  switch (symbol) {
    case 'ABT':
      return require('../images/logos/ABT.png');

    case 'AE':
      return require('../images/logos/AE.png');

    case 'AGI':
      return require('../images/logos/AGI.png');

    case 'AION':
      return require('../images/logos/AION.png');

    case 'AIR':
      return require('../images/logos/AIR.png');

    case 'AIX':
      return require('../images/logos/AIX.png');

    case 'ANT':
      return require('../images/logos/ANT.png');

    case 'ARN':
      return require('../images/logos/ARN.png');

    case 'ART':
      return require('../images/logos/ART.png');

    case 'AST':
      return require('../images/logos/AST.png');

    case 'AUC':
      return require('../images/logos/AUC.png');

    case 'BAX':
      return require('../images/logos/BAX.png');

    case 'BCDT':
      return require('../images/logos/BCDT.png');

    case 'BEE':
      return require('../images/logos/BEE.png');

    case 'BERRY':
      return require('../images/logos/BERRY.png');

    case 'BLT':
      return require('../images/logos/BLT.png');

    case 'BLZ':
      return require('../images/logos/BLZ.png');

    case 'BNT':
      return require('../images/logos/BNT.png');

    case 'BNTY':
      return require('../images/logos/BNTY.png');

    case 'CAG':
      return require('../images/logos/CAG.png');

    case 'CAN':
      return require('../images/logos/CAN.png');

    case 'CAT':
      return require('../images/logos/CAT.png');

    case 'CBT':
      return require('../images/logos/CBT.png');

    case 'CDT':
      return require('../images/logos/CDT.png');

    case 'CFI':
      return require('../images/logos/CFI.png');

    case 'CL':
      return require('../images/logos/CL.png');

    case 'CND':
      return require('../images/logos/CND.png');

    case 'CRED':
      return require('../images/logos/CRED.png');

    case 'CVC':
      return require('../images/logos/CVC.png');

    case 'CVT':
      return require('../images/logos/CVT.png');

    case 'DAI':
      return require('../images/logos/DAI.png');

    case 'DALA':
      return require('../images/logos/DALA.png');

    case 'DATA':
      return require('../images/logos/DATA.png');

    case 'DCL':
      return require('../images/logos/DCL.png');

    case 'DENT':
      return require('../images/logos/DENT.png');

    case 'DFS':
      return require('../images/logos/DFS.png');

    case 'DGD':
      return require('../images/logos/DGD.png');

    case 'DGPT':
      return require('../images/logos/DGPT.png');

    case 'DNT':
      return require('../images/logos/DNT.png');

    case 'DOV':
      return require('../images/logos/DOV.png');

    case 'DPP':
      return require('../images/logos/DPP.png');

    case 'DRT':
      return require('../images/logos/DRT.png');

    case 'DXT':
      return require('../images/logos/DXT.png');

    case 'EBTC':
      return require('../images/logos/EBTC.png');

    case 'ELF':
      return require('../images/logos/ELF.png');

    case 'EMONT':
      return require('../images/logos/EMONT.png');

    case 'ENO':
      return require('../images/logos/ENO.png');

    case 'ENTRP':
      return require('../images/logos/ENTRP.png');

    case 'ETH':
      return require('../images/logos/ETH.png');

    case 'ETHOS':
      return require('../images/logos/ETHOS.png');

    case 'EUSD':
      return require('../images/logos/EUSD.png');

    case 'EVC':
      return require('../images/logos/EVC.png');

    case 'EVE':
      return require('../images/logos/EVE.png');

    case 'FDX':
      return require('../images/logos/FDX.png');

    case 'FLIP':
      return require('../images/logos/FLIP.png');

    case 'FLLW':
      return require('../images/logos/FLLW.png');

    case 'FND':
      return require('../images/logos/FND.png');

    case 'FUEL':
      return require('../images/logos/FUEL.png');

    case 'FUN':
      return require('../images/logos/FUN.png');

    case 'FYN':
      return require('../images/logos/FYN.png');

    case 'GET':
      return require('../images/logos/GET.png');

    case 'GNO':
      return require('../images/logos/GNO.png');

    case 'GNT':
      return require('../images/logos/GNT.png');

    case 'GOAL':
      return require('../images/logos/GOAL.png');

    case 'GOLDX':
      return require('../images/logos/GOLDX.png');

    case 'GRID':
      return require('../images/logos/GRID.png');

    case 'GUP':
      return require('../images/logos/GUP.png');

    case 'HAV':
      return require('../images/logos/HAV.png');

    case 'HGT':
      return require('../images/logos/HGT.png');

    case 'HIRE':
      return require('../images/logos/HIRE.png');

    case 'HST':
      return require('../images/logos/HST.png');

    case 'ICX':
      return require('../images/logos/ICX.png');

    case 'IFT':
      return require('../images/logos/IFT.png');

    case 'INS':
      return require('../images/logos/INS.png');

    case 'INXT':
      return require('../images/logos/INXT.png');

    case 'IOST':
      return require('../images/logos/IOST.png');

    case 'JNT':
      return require('../images/logos/JNT.png');

    case 'KICK':
      return require('../images/logos/KICK.png');

    case 'KNC':
      return require('../images/logos/KNC.png');

    case 'LEND':
      return require('../images/logos/LEND.png');

    case 'LINK':
      return require('../images/logos/LINK.png');

    case 'LNK':
      return require('../images/logos/LNK.png');

    case 'LOC':
      return require('../images/logos/LOC.png');

    case 'LOOM':
      return require('../images/logos/LOOM.png');

    case 'MANA':
      return require('../images/logos/MANA.png');

    case 'MBRS':
      return require('../images/logos/MBRS.png');

    case 'MKR':
      return require('../images/logos/MKR.png');

    case 'MLN':
      return require('../images/logos/MLN.png');

    case 'MTL':
      return require('../images/logos/MTL.png');

    case 'MWAT':
      return require('../images/logos/MWAT.png');

    case 'NEWB':
      return require('../images/logos/NEWB.png');

    case 'NMR':
      return require('../images/logos/NMR.png');

    case 'NVT':
      return require('../images/logos/NVT.png');

    case 'OMG':
      return require('../images/logos/OMG.png');

    case 'PCL':
      return require('../images/logos/PCL.png');

    case 'PLU':
      return require('../images/logos/PLU.png');

    case 'POE':
      return require('../images/logos/POE.png');

    case 'POLY':
      return require('../images/logos/POLY.png');

    case 'POW':
      return require('../images/logos/POW.png');

    case 'POWR':
      return require('../images/logos/POWR.png');

    case 'PTOY':
      return require('../images/logos/PTOY.png');

    case 'QSP':
      return require('../images/logos/QSP.png');

    case 'QVT':
      return require('../images/logos/QVT.png');

    case 'RCN':
      return require('../images/logos/RCN.png');

    case 'RDN':
      return require('../images/logos/RDN.png');

    case 'REAL':
      return require('../images/logos/REAL.png');

    case 'REN':
      return require('../images/logos/REN.png');

    case 'REP':
      return require('../images/logos/REP.png');

    case 'REQ':
      return require('../images/logos/REQ.png');

    case 'RHOC':
      return require('../images/logos/RHOC.png');

    case 'RKT':
      return require('../images/logos/RKT.png');

    case 'RLC':
      return require('../images/logos/RLC.png');

    case 'RVT':
      return require('../images/logos/RVT.png');

    case 'SALT':
      return require('../images/logos/SALT.png');

    case 'SHP':
      return require('../images/logos/SHP.png');

    case 'SNIP':
      return require('../images/logos/SNIP.png');

    case 'SNM':
      return require('../images/logos/SNM.png');

    case 'SNOV':
      return require('../images/logos/SNOV.png');

    case 'SNT':
      return require('../images/logos/SNT.png');

    case 'SPANK':
      return require('../images/logos/SPANK.png');

    case 'STAC':
      return require('../images/logos/STAC.png');

    case 'STORJ':
      return require('../images/logos/STORJ.png');

    case 'STORM':
      return require('../images/logos/STORM.png');

    case 'STU':
      return require('../images/logos/STU.png');

    case 'SUB':
      return require('../images/logos/SUB.png');

    case 'TAU':
      return require('../images/logos/TAU.png');

    case 'THETA':
      return require('../images/logos/THETA.png');

    case 'TIX':
      return require('../images/logos/TIX.png');

    case 'UFR':
      return require('../images/logos/UFR.png');

    case 'UKG':
      return require('../images/logos/UKG.png');

    case 'VEE':
      return require('../images/logos/VEE.png');

    case 'VIT':
      return require('../images/logos/VIT.png');

    case 'WAND':
      return require('../images/logos/WAND.png');

    case 'WAX':
      return require('../images/logos/WAX.png');

    case 'WETH':
      return require('../images/logos/WETH.png');

    case 'WLK':
      return require('../images/logos/WLK.png');

    case 'WYS':
      return require('../images/logos/WYS.png');

    case 'XAUR':
      return require('../images/logos/XAUR.png');

    case 'XGM':
      return require('../images/logos/XGM.png');

    case 'XRL':
      return require('../images/logos/XRL.png');

    case 'XSC':
      return require('../images/logos/XSC.png');

    case 'ZAP':
      return require('../images/logos/ZAP.png');

    case 'ZAPIT':
      return require('../images/logos/ZAPIT.png');

    case 'ZIL':
      return require('../images/logos/ZIL.png');

    case 'ZRX':
      return require('../images/logos/ZRX.png');

    default:
      return require('../images/logos/WETH.png');
  }
}

export function formatTimestamp(timestamp) {
  return moment.unix(timestamp).format('MMMM Do YYYY, h:mm:ss a');
}

export function formatMoney(n) {
  return '$' + zeroDecimalPad(Math.floor(n * 100) / 100, 2).toString();
}

export function formatPercent(n) {
  return (Math.round(n * 10000) / 100).toString() + '%';
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
