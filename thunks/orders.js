import { HttpClient } from '@0xproject/connect';
import * as _ from 'lodash';
import BigNumber from 'bignumber.js';
import {
  addActiveTransactions,
  addOrders,
  addTickerWatching,
  setOrders,
  setProducts,
  setTokens
} from '../actions';
import { getAccount, getTokenByAddress, getZeroExClient } from '../utils';
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

export function cancelOrder(order) {
  return async (dispatch, getState) => {
    try {
      const {
        wallet: { web3, address }
      } = getState();
      const zeroEx = await getZeroExClient(web3);

      if (order.maker !== address) {
        throw new Error('Cannot cancel order that is not yours');
      }

      const txhash = await zeroEx.exchange.cancelOrderAsync(
        order,
        new BigNumber(order.makerTokenAmount)
      );

      const activeTransaction = {
        id: txhash,
        type: 'CANCEL',
        ...order
      };
      dispatch(addActiveTransactions([activeTransaction]));
      const receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
      console.log('Receipt: ', receipt);
    } catch (err) {
      dispatch(gotoErrorScreen(err));
    }
  };
}

export function fillOrder(order, amount = null) {
  return async (dispatch, getState) => {
    try {
      const {
        wallet: { web3 }
      } = getState();
      const zeroEx = await getZeroExClient(web3);
      const account = await getAccount(web3);
      const amountBN = amount
        ? new BigNumber(amount)
        : new BigNumber(order.takerTokenAmount);
      const txhash = await zeroEx.exchange.fillOrderAsync(
        order,
        amountBN,
        true,
        account.toLowerCase(),
        { shouldValidate: true }
      );
      const activeTransaction = {
        id: txhash,
        type: 'FILL',
        ...order
      };
      dispatch(addActiveTransactions([activeTransaction]));
      const receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
      console.log('Receipt: ', receipt);
    } catch (err) {
      dispatch(gotoErrorScreen(err));
    }
  };
}

export function fillOrders(orders, amount) {
  return async (dispatch, getState) => {
    try {
      const {
        wallet: { web3 }
      } = getState();

      const zeroEx = await getZeroExClient(web3);
      const account = await getAccount(web3);
      let amountBN = new BigNumber(amount);
      const ordersToFill = _.chain(orders)
        .map(o => {
          if (amountBN.gt(o.takerTokenAmount)) {
            amountBN = amountBN.sub(o.takerTokenAmount);
            return {
              signedOrder: o,
              takerTokenFillAmount: new BigNumber(o.takerTokenAmount)
            };
          } else {
            return {
              signedOrder: o,
              takerTokenFillAmount: new BigNumber(amountBN)
            };
          }
        })
        .filter(_.identity)
        .value();

      const txhash = await zeroEx.exchange.batchFillOrKillAsync(
        ordersToFill,
        account.toLowerCase(),
        { shouldValidate: true }
      );
      const activeTransaction = {
        id: txhash,
        type: 'BATCH_FILL',
        amount: amount
      };
      dispatch(addActiveTransactions([activeTransaction]));
      const receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
      console.log('Receipt: ', receipt);
    } catch (err) {
      dispatch(gotoErrorScreen(err));
    }
  };
}
