import * as _ from 'lodash';
import { updateForexTicker, updateTokenTicker } from '../actions';
import { cache, getForexTicker, getTokenTicker } from '../utils';

export function updateForexTickers(force = false) {
  return async (dispatch, getState) => {
    let {
      relayer: { tokens },
      settings: { network, forexCurrency }
    } = getState();
    const ticker = await cache(
      'ticker:forex',
      async () => {
        const products = tokens.map(
          ({ symbol }) => `${symbol}-${forexCurrency}`
        );
        const jsonResponse = await getForexTicker(network, {
          products
        });
        return jsonResponse;
      },
      force ? 0 : 60
    );
    dispatch(updateForexTicker(ticker));
  };
}

export function updateTokenTickers(force = false) {
  return async (dispatch, getState) => {
    const {
      relayer: { products, tokens },
      settings: { network }
    } = getState();
    const ticker = await cache(
      'ticker:token',
      async () => {
        const _products = products
          .map(({ tokenA, tokenB }) => [
            _.find(tokens, { address: tokenA.address }),
            _.find(tokens, { address: tokenB.address })
          ])
          .filter(([tokenA, tokenB]) => tokenA && tokenB)
          .map(([tokenA, tokenB]) => `${tokenB.symbol}-${tokenA.symbol}`);
        const jsonResponse = await getTokenTicker(network, {
          products: _products
        });
        return jsonResponse;
      },
      force ? 0 : 60
    );
    dispatch(updateTokenTicker(ticker));
  };
}
