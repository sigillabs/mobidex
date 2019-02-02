import * as _ from 'lodash';
import {
  updateForexTicker as _updateForexTicker,
  updateTokenTicker as _updateTokenTicker
} from '../actions';
import Inf0xClient from '../clients/inf0x';

export function updateForexTickers(force = false) {
  return async (dispatch, getState) => {
    let {
      relayer: { assets },
      settings: { network, forexCurrency, inf0xEndpoint }
    } = getState();
    const client = new Inf0xClient(inf0xEndpoint, { network });
    const products = assets.map(({ symbol }) => `${symbol}-${forexCurrency}`);
    const jsonResponse = await client.getForexTicker(products, force);
    dispatch(_updateForexTicker(jsonResponse));
  };
}

export function updateForexTicker(symbol, force = false) {
  return async (dispatch, getState) => {
    let {
      settings: { network, forexCurrency, inf0xEndpoint }
    } = getState();
    const client = new Inf0xClient(inf0xEndpoint, { network });
    const product = `${symbol}-${forexCurrency}`;
    const jsonResponse = await client.getForexTicker([product], force);
    dispatch(_updateForexTicker(jsonResponse));
  };
}

export function updateTokenTickers(force = false) {
  return async (dispatch, getState) => {
    const {
      relayer: { products, assets },
      settings: { network, inf0xEndpoint }
    } = getState();
    const client = new Inf0xClient(inf0xEndpoint, { network });
    const _products = products
      .map(({ assetDataA, assetDataB }) => [
        _.find(assets, { address: assetDataA.address }),
        _.find(assets, { address: assetDataB.address })
      ])
      .filter(([tokenA, tokenB]) => tokenA && tokenB)
      .map(([tokenA, tokenB]) => `${tokenB.symbol}-${tokenA.symbol}`);
    const jsonResponse = await client.getTokenTicker(_products, force);
    dispatch(_updateTokenTicker(jsonResponse));
  };
}

export function updateTokenTicker(baseSymbol, quoteSymbol, force = false) {
  return async (dispatch, getState) => {
    const {
      settings: { network, inf0xEndpoint }
    } = getState();
    const client = new Inf0xClient(inf0xEndpoint, { network });
    const product = `${baseSymbol}-${quoteSymbol}`;
    const jsonResponse = await client.getTokenTicker([product], force);
    dispatch(_updateTokenTicker(jsonResponse));
  };
}
