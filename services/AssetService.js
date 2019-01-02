import * as _ from 'lodash';

let _store;

export function setStore(store) {
  _store = store;
}

export function findAssetByData(assetData) {
  const {
    relayer: { assets }
  } = _store.getState();
  return _.find(assets, { assetData });
}

export function findAssetByAddress(address) {
  const {
    relayer: { assets }
  } = _store.getState();
  return _.find(assets, { address });
}

export function findAssetBySymbol(symbol) {
  const {
    relayer: { assets }
  } = _store.getState();
  return _.find(assets, { symbol });
}

export function getFeeAsset() {
  const {
    relayer: { assets },
    settings: { feeSymbol }
  } = _store.getState();
  return _.find(assets, { symbol: feeSymbol });
}

export function getNetworkFeeAsset() {
  const {
    relayer: { assets },
    settings: { networkFeeSymbol }
  } = _store.getState();
  return _.find(assets, { symbol: networkFeeSymbol });
}

export function getQuoteAsset() {
  const {
    relayer: { assets },
    settings: { quoteSymbol }
  } = _store.getState();
  return _.find(assets, { symbol: quoteSymbol });
}

export function getWETHAsset() {
  const {
    relayer: { assets }
  } = _store.getState();
  return _.find(assets, { symbol: 'WETH' });
}
