import * as _ from 'lodash';
import { updateForexTicker, updateTokenTicker } from '../actions';
import Inf0xClient from '../clients/inf0x';
import { cache } from '../utils';

export function updateForexTickers(force = false) {
  return async (dispatch, getState) => {
    let {
      relayer: { tokens },
      settings: { network, forexCurrency, inf0xBaseURL }
    } = getState();
    const ticker = await cache(
      'ticker:forex',
      async () => {
        const client = Inf0xClient(inf0xBaseURL, { network });
        const products = tokens.map(
          ({ symbol }) => `${symbol}-${forexCurrency}`
        );

        const jsonResponse = await client.getForexTicker(products);
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
      settings: { network, inf0xBaseURL }
    } = getState();
    const ticker = await cache(
      'ticker:token',
      async () => {
        const client = Inf0xClient(inf0xBaseURL, { network });
        const _products = products
          .map(({ tokenA, tokenB }) => [
            _.find(tokens, { address: tokenA.address }),
            _.find(tokens, { address: tokenB.address })
          ])
          .filter(([tokenA, tokenB]) => tokenA && tokenB)
          .map(([tokenA, tokenB]) => `${tokenB.symbol}-${tokenA.symbol}`);
        const jsonResponse = await client.getTokenTicker(_products);
        return jsonResponse;
      },
      force ? 0 : 60
    );
    dispatch(updateTokenTicker(ticker));
  };
}
