import * as _ from 'lodash';

const ETHEREUM_ASSET = {
  address: null,
  symbol: 'ETH',
  name: 'Ethereum',
  decimals: 18,
  isEthereum: true,
};

let _store;

export function setStore(store) {
  _store = store;
}

export function findAssetByAddress(address) {
  if (address === null || address === 'ETH') {
    return ETHEREUM_ASSET;
  }
  const {tokens} = _store.getState();
  return _.find(tokens, {address: address.toLowerCase()});
}

export function getFeeAsset() {
  const {
    relayer: {assets},
    settings: {feeSymbol},
  } = _store.getState();
  return _.find(assets, {symbol: feeSymbol});
}

export function getNetworkFeeAsset() {
  const {
    relayer: {assets},
    settings: {networkFeeSymbol},
  } = _store.getState();
  return _.find(assets, {symbol: networkFeeSymbol});
}

export function getQuoteAsset() {
  const {
    relayer: {assets},
    settings: {quoteSymbol},
  } = _store.getState();
  return _.find(assets, {symbol: quoteSymbol});
}

export function getWETHAsset() {
  const {
    relayer: {assets},
  } = _store.getState();
  return _.find(assets, {symbol: 'WETH'});
}
