import * as _ from 'lodash';
import { updateForexTicker, updateTokenTicker } from '../actions';
import { getForexTicker, getTokenTicker } from '../utils';

export function updateForexTickers() {
  return async (dispatch, getState) => {
    let {
      relayer: { tokens },
      settings: { network, forexCurrency }
    } = getState();
    const products = tokens.map(({ symbol }) => `${symbol}-${forexCurrency}`);
    const jsonResponse = await getForexTicker(network, {
      products
    });
    dispatch(updateForexTicker(jsonResponse));
  };
}

export function updateTokenTickers() {
  return async (dispatch, getState) => {
    const {
      relayer: { products, tokens },
      settings: { network }
    } = getState();
    const _products = products
      .map(({ tokenA, tokenB }) => [
        _.find(tokens, { address: tokenA.address }),
        _.find(tokens, { address: tokenB.address })
      ])
      .filter(([tokenA, tokenB]) => tokenA && tokenB)
      .map(([tokenA, tokenB]) => `${tokenB.symbol}-${tokenA.symbol}`);
    const jsonResponse = await getTokenTicker(network, { products: _products });
    dispatch(updateTokenTicker(jsonResponse));
  };
}
