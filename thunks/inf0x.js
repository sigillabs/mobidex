import BigNumber from 'bignumber.js';
import { Linking } from 'react-native';
import Wallet from 'ethereumjs-wallet';
import ethUtil from 'ethereumjs-util';
import * as qs from 'qs';
import { updateForexTicker, updateTokenTicker } from '../actions';
import { getForexTicker, getTokenTicker } from '../utils';

export function updateForexTickers(force = false) {
  return async (dispatch, getState) => {
    let {
      ticker: { watching },
      settings: { network, forexCurrency }
    } = getState();

    const jsonResponse = await getForexTicker(network, watching, forexCurrency);

    dispatch(updateForexTicker(jsonResponse));
  };
}

export function updateTokenTickers(force = false) {
  return async (dispatch, getState) => {
    let {
      ticker: { watching },
      settings: { network, quoteToken }
    } = getState();

    const jsonResponse = await getTokenTicker(
      network,
      watching,
      quoteToken.symbol
    );

    dispatch(updateTokenTicker(jsonResponse));
  };
}
