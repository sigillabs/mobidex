import * as _ from 'lodash';
import { updateForexTicker, updateTokenTicker } from '../actions';
import Inf0xClient from '../clients/inf0x';
import { cache } from '../utils';

export function updateForexTickers(force = false) {
  return async (dispatch, getState) => {
    let {
      relayer: { tokens },
      settings: { network, forexCurrency, inf0xEndpoint }
    } = getState();
    const client = new Inf0xClient(inf0xEndpoint, { network });
    const products = tokens.map(({ symbol }) => `${symbol}-${forexCurrency}`);

    const jsonResponse = await client.getForexTicker(products, force);
    dispatch(updateForexTicker(jsonResponse));
  };
}

export function updateTokenTickers(force = false) {
  return async (dispatch, getState) => {
    const {
      relayer: { products, tokens },
      settings: { network, inf0xEndpoint }
    } = getState();
    const client = new Inf0xClient(inf0xEndpoint, { network });
    const _products = products
      .map(({ tokenA, tokenB }) => [
        _.find(tokens, { address: tokenA.address }),
        _.find(tokens, { address: tokenB.address })
      ])
      .filter(([tokenA, tokenB]) => tokenA && tokenB)
      .map(([tokenA, tokenB]) => `${tokenB.symbol}-${tokenA.symbol}`);
    const jsonResponse = await client.getTokenTicker(_products, force);
    dispatch(updateTokenTicker(jsonResponse));
  };
}
