import { HttpClient } from '@0xproject/connect';
import * as _ from 'lodash';
import { addOrders, setOrders, setProducts, setTokens } from '../actions';
import { cache, getTokenByAddress } from '../utils';
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

export function loadProducts(force = false) {
  return async (dispatch, getState) => {
    const {
      settings: { relayerEndpoint }
    } = getState();

    try {
      const pairs = await cache(
        'products',
        async () => {
          const client = new HttpClient(relayerEndpoint);
          const pairs = await client.getTokenPairsAsync();
          return pairs;
        },
        force ? 0 : 24 * 60 * 60
      );
      dispatch(setProducts(pairs));
    } catch (err) {
      dispatch(gotoErrorScreen(err));
    }
  };
}

export function loadTokens(force = false) {
  return async (dispatch, getState) => {
    const {
      relayer: { products },
      wallet: { web3 }
    } = getState();

    try {
      const tokens = await cache(
        'tokens',
        async () => {
          const productsA = products.map(pair => pair.tokenA);
          const productsB = products.map(pair => pair.tokenB);
          const allTokens = _.unionBy(productsA, productsB, 'address');
          const allExtendedTokens = await Promise.all(
            allTokens.map(async token => {
              const extendedToken = await getTokenByAddress(
                web3,
                token.address,
                force
              );
              return {
                ...token,
                ...extendedToken
              };
            })
          );
          return allExtendedTokens;
        },
        force ? 0 : 24 * 60 * 60
      );
      dispatch(setTokens(tokens));
    } catch (err) {
      dispatch(gotoErrorScreen(err));
    }
  };
}

export function loadProductsAndTokens(force = false) {
  return async dispatch => {
    await dispatch(loadProducts());
    await dispatch(loadTokens(force));
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
