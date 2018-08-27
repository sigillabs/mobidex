import { HttpClient } from '@0xproject/connect';
import * as _ from 'lodash';
import { addOrders, setOrders, setProducts, setTokens } from '../actions';
import EthereumClient from '../clients/ethereum';
import RelayerClient from '../clients/relayer';
import TokenClient from '../clients/token';
import { gotoErrorScreen } from './navigation';

export function loadOrders() {
  return async (dispatch, getState) => {
    let {
      settings: { network, relayerEndpoint }
    } = getState();

    try {
      const client = new RelayerClient(relayerEndpoint, { network });
      const orders = await client.getOrders();
      dispatch(setOrders(orders));
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
      settings: { network, relayerEndpoint }
    } = getState();

    try {
      const client = new RelayerClient(relayerEndpoint, { network });
      const order = await client.getOrder(orderHash);
      dispatch(setOrders([order]));
    } catch (err) {
      dispatch(gotoErrorScreen(err));
    }
  };
}

export function loadProducts(force = false) {
  return async (dispatch, getState) => {
    const {
      settings: { network, relayerEndpoint }
    } = getState();

    try {
      const client = new RelayerClient(relayerEndpoint, { network });
      const pairs = await client.getTokenPairs(force);
      dispatch(setProducts(pairs));
    } catch (err) {
      console.warn(err);
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
      const ethereumClient = new EthereumClient(web3);
      const productsA = products.map(pair => pair.tokenA);
      const productsB = products.map(pair => pair.tokenB);
      const allTokens = _.unionBy(productsA, productsB, 'address');
      const allExtendedTokens = await Promise.all(
        allTokens.map(async token => {
          const tokenClient = new TokenClient(ethereumClient, token.address);
          const extendedToken = await tokenClient.get(force);
          return {
            ...token,
            ...extendedToken
          };
        })
      );
      dispatch(setTokens(allExtendedTokens));
    } catch (err) {
      dispatch(gotoErrorScreen(err));
    }
  };
}

export function loadProductsAndTokens() {
  return async dispatch => {
    await dispatch(loadProducts());
    await dispatch(loadTokens());
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
