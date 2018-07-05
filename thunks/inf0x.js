import * as _ from 'lodash';
import { updateForexTicker, updateTokenTicker } from '../actions';
import { getForexTicker, getTokenTicker } from '../utils';

export function updateForexTickers() {
  return async (dispatch, getState) => {
    let {
      ticker: { watching },
      settings: { network, forexCurrency }
    } = getState();
    const products = _.chain(watching)
      .map(({ tokenA, tokenB }) => [
        `${tokenA.symbol}-${forexCurrency}`,
        `${tokenB.symbol}-${forexCurrency}`
      ])
      .flatten()
      .uniq()
      .value();
    const jsonResponse = await getForexTicker(network, { products });
    dispatch(updateForexTicker(jsonResponse));
  };
}

export function updateTokenTickers() {
  return async (dispatch, getState) => {
    const {
      ticker: { watching },
      settings: { network }
    } = getState();
    const products = watching.map(
      ({ tokenA, tokenB }) => `${tokenB.symbol}-${tokenA.symbol}`
    );
    const jsonResponse = await getTokenTicker(network, { products });
    dispatch(updateTokenTicker(jsonResponse));
  };
}
