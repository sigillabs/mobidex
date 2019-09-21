import * as _ from 'lodash';

const ETHEREUM_ASSET = {
  address: null,
  symbol: 'ETH',
  name: 'Ethereum',
  decimals: 18,
  isEthereum: true,
};

const WETH_ASSET = {
  address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  symbol: 'WETH',
  name: 'Wrapped Ethereum',
  decimals: 18,
};

let _store;

export function setStore(store) {
  _store = store;
}

export function isEthereum(address) {
  return address === undefined || address === null || address === 'ETH';
}

export function isWETH(address) {
  return address === WETH_ASSET.address;
}

export function findAssetByAddress(address) {
  if (isEthereum(address)) {
    return getETHAsset();
  }
  if (isWETH(address)) {
    return getWETHAsset();
  }
  const {tokens} = _store.getState();
  return _.find(tokens, {address: address.toLowerCase()});
}

export function getETHAsset() {
  return ETHEREUM_ASSET;
}

export function getWETHAsset() {
  return WETH_ASSET;
}
