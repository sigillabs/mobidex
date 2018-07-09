import { HttpClient } from '@0xproject/connect';
import * as _ from 'lodash';
import {
  addOrders,
  addTickerWatching,
  setOrders,
  setProducts,
  setTokens
} from '../actions';
import { getTokenByAddress } from '../utils';
import { gotoErrorScreen } from './navigation';

export function loadOrders() {
  return async (dispatch, getState) => {
    let {
      settings: { relayerEndpoint }
    } = getState();
    let client = new HttpClient(relayerEndpoint);

    try {
      dispatch(setOrders(await client.getOrdersAsync()));
      return true;
    } catch (err) {
      dispatch(gotoErrorScreen(err));
      return false;
    }
  };
}

export function loadOrder(orderHash) {
  return async (dispatch, getState) => {
    let {
      settings: { relayerEndpoint }
    } = getState();
    let client = new HttpClient(relayerEndpoint);

    try {
      dispatch(addOrders([await client.getOrderAsync(orderHash)]));
    } catch (err) {
      dispatch(gotoErrorScreen(err));
    }
  };
}

export function loadProductsAndTokens(force = false) {
  return async (dispatch, getState) => {
    let {
      settings: { relayerEndpoint },
      wallet: { web3 }
    } = getState();
    let client = new HttpClient(relayerEndpoint);

    try {
      let pairs = await client.getTokenPairsAsync();
      let tokensA = pairs.map(pair => pair.tokenA);
      let tokensB = pairs.map(pair => pair.tokenB);
      let extTokensA = await Promise.all(
        tokensA
          .map(token => getTokenByAddress(web3, token.address, force))
          .filter(t => t)
      );
      let extTokensB = await Promise.all(
        tokensB
          .map(token => getTokenByAddress(web3, token.address, force))
          .filter(t => t)
      );
      let fullTokensA = tokensA.map((token, index) => ({
        ...token,
        ...extTokensA[index]
      }));
      let fullTokensB = tokensB.map((token, index) => ({
        ...token,
        ...extTokensB[index]
      }));
      let lookupA = _.keyBy(fullTokensA, 'address');
      let lookupB = _.keyBy(fullTokensB, 'address');
      let tokens = _.unionBy(fullTokensA, fullTokensB, 'address');
      dispatch(setTokens(tokens));
      dispatch(setProducts(pairs));
      dispatch(
        addTickerWatching(
          pairs.map(({ tokenA, tokenB }) => ({
            tokenA: lookupA[tokenA.address],
            tokenB: lookupB[tokenB.address]
          }))
        )
      );
    } catch (err) {
      dispatch(gotoErrorScreen(err));
    }
  };
}

export function submitOrder(signedOrder) {
  return async (dispatch, getState) => {
    try {
      const {
        settings: { relayerEndpoint }
      } = getState();
      const relayerClient = new HttpClient(relayerEndpoint);

      // Submit
      await relayerClient.submitOrderAsync(signedOrder);

      dispatch(addOrders([signedOrder]));
    } catch (err) {
      dispatch(gotoErrorScreen(err));
    }
  };
}
