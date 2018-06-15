import BigNumber from 'bignumber.js';
import * as _ from 'lodash';

let _store;

export function setStore(store) {
  _store = store;
}

export function getAssetByAddress(address) {
  const {
    wallet: { assets }
  } = _store.getState();
  return _.find(assets, { address });
}

export function getAssetBySymbol(symbol) {
  const {
    wallet: { assets }
  } = _store.getState();
  return _.find(assets, { symbol });
}

export function getBalanceByAddress(address) {
  const asset = getAssetByAddress(address);
  if (!asset) return new BigNumber(0);
  if (asset.symbol === 'WETH' || asset.symbol === 'ETH')
    return getEthereumBalance();
  return new BigNumber(asset.balance);
}

export function getBalanceBySymbol(symbol) {
  if (symbol === 'WETH' || symbol === 'ETH') return getEthereumBalance();
  const asset = getAssetBySymbol(symbol);
  if (!asset) return new BigNumber(0);
  return new BigNumber(asset.balance);
}

export function getEthereumBalance() {
  const asset1 = getAssetBySymbol('ETH');
  const asset2 = getAssetBySymbol('WETH');
  let sum = new BigNumber(0);
  if (asset1) sum = sum.add(asset1.balance);
  if (asset2) sum = sum.add(asset2.balance);
  return sum;
}

export function getDecimalsByAddress(address) {
  const asset = getAssetByAddress(address);
  if (!asset) return 0;
  return asset.decimals;
}

export function getDecimalsBySymbol(symbol) {
  const asset = getAssetBySymbol(symbol);
  if (!asset) return 0;
  return asset.decimals;
}
