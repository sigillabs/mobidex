import { HttpClient } from '@0xproject/connect';
import * as _ from 'lodash';
import { addOrders, setOrders, setProducts, setTokens } from '../actions';
import {
  asyncTimingWrapper,
  cache,
  getOrder,
  getOrders,
  getTokenByAddress,
  getTokenPairs
} from '../utils';
import { gotoErrorScreen } from './navigation';

const getTokenByAddressWithTiming = asyncTimingWrapper(getTokenByAddress);
const getOrderWithTiming = asyncTimingWrapper(getOrder);
const getOrdersWithTiming = asyncTimingWrapper(getOrders);
const getTokenPairsWithTiming = asyncTimingWrapper(getTokenPairs);

export function loadOrders() {
  return async (dispatch, getState) => {
    let { settings } = getState();

    try {
      dispatch(setOrders(await getOrdersWithTiming(settings)));
      return true;
    } catch (err) {
      dispatch(gotoErrorScreen(err));
      return false;
    }
  };
}

export function loadOrder(orderHash) {
  return async (dispatch, getState) => {
    let { settings } = getState();

    try {
      dispatch(setOrders([await getOrderWithTiming(orderHash, settings)]));
    } catch (err) {
      dispatch(gotoErrorScreen(err));
    }
  };
}

export function loadProducts(force = false) {
  return async (dispatch, getState) => {
    const { settings } = getState();

    try {
      const pairs = await cache(
        'products',
        async () => {
          const pairs = await getTokenPairsWithTiming(settings);
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
              const extendedToken = await getTokenByAddressWithTiming(
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
