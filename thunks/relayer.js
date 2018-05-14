import * as _ from 'lodash';
import { HttpClient } from '@0xproject/connect';
import { ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { NavigationActions } from 'react-navigation';
import { addTickerWatching, setError } from '../actions';
import { loadTransactions } from '../thunks';
import {
  batchFillOrKill,
  cancelOrder as cancelOrderUtil,
  convertLimitOrderToZeroExOrder,
  fillOrder as fillOrderUtil,
  filterAndSortOrdersByTokens,
  filterOrdersToBaseAmount,
  getTokenAllowance,
  getTokenByAddress,
  getZeroExClient,
  getZeroExContractAddress,
  guaranteeWETHInWeiAmount,
  setTokenUnlimitedAllowance,
  signOrder,
  isWETHAddress
} from '../utils';
import {
  addOrders,
  notProcessing,
  processing,
  setOrders,
  setProducts,
  setTokens
} from '../actions';

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
      dispatch(setError(err));
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
      dispatch(setError(err));
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
      console.warn(err);
      dispatch(setError(err));
    }
  };
}

export function createSignSubmitOrder(price, amount, base, quote, side) {
  return async (dispatch, getState) => {
    try {
      dispatch(processing());

      let {
        wallet: { web3, address },
        settings: { relayerEndpoint }
      } = getState();
      let zeroEx = await getZeroExClient(web3);
      let relayerClient = new HttpClient(relayerEndpoint);
      let order = {
        ...convertLimitOrderToZeroExOrder(price, amount, base, quote, side),
        maker: address.toLowerCase(),
        makerFee: new BigNumber(0),
        taker: ZeroEx.NULL_ADDRESS,
        takerFee: new BigNumber(0),
        expirationUnixTimestampSec: new BigNumber(
          moment().unix() + 60 * 60 * 24
        ),
        feeRecipient: ZeroEx.NULL_ADDRESS,
        salt: ZeroEx.generatePseudoRandomSalt(),
        exchangeContractAddress: await getZeroExContractAddress(web3)
      };
      let allowance = await getTokenAllowance(web3, order.makerTokenAddress);

      // Make sure allowance is available.
      if (order.makerTokenAmount.gt(allowance)) {
        let txhash = await setTokenUnlimitedAllowance(
          web3,
          order.makerTokenAddress
        );
        let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
      }

      // Guarantee WETH is available.
      if (await isWETHAddress(web3, order.makerTokenAddress)) {
        let txhash = await guaranteeWETHInWeiAmount(
          web3,
          order.makerTokenAmount
        );
        if (txhash) {
          let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
        }
      }

      // Sign
      let signedOrder = await signOrder(web3, order);

      // Submit
      await relayerClient.submitOrderAsync(signedOrder);

      dispatch(addOrders([signedOrder]));
    } catch (err) {
      console.warn(err);
      await dispatch(setError(err));
    } finally {
      dispatch(notProcessing());
      dispatch(NavigationActions.push({ routeName: 'List' }));
    }
  };
}

export function cancelOrder(order) {
  return async (dispatch, getState) => {
    try {
      dispatch(processing());

      let {
        wallet: { web3, address }
      } = getState();
      let zeroEx = await getZeroExClient(web3);

      if (order.maker !== address) {
        throw new Error('Cannot cancel order that is not yours');
      }

      let txhash = await cancelOrderUtil(web3, order, order.makerTokenAmount);
      let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
    } catch (err) {
      console.warn(err);
      dispatch(setError(err));
    } finally {
      dispatch(notProcessing());
      dispatch(NavigationActions.push({ routeName: 'Trading' }));
    }
  };
}

export function fillOrder(order) {
  return async (dispatch, getState) => {
    dispatch(processing());

    try {
      let {
        wallet: { web3 }
      } = getState();
      let zeroEx = await getZeroExClient(web3);
      let allowance = await getTokenAllowance(web3, order.takerTokenAddress);
      let fillAmount = new BigNumber(order.takerTokenAmount);

      // Make sure allowance is available.
      if (fillAmount.gt(allowance)) {
        let txhash = await setTokenUnlimitedAllowance(
          web3,
          order.takerTokenAddress
        );
        let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
      }

      // Guarantee WETH is available.
      if (await isWETHAddress(web3, order.takerTokenAddress)) {
        let txhash = await guaranteeWETHInWeiAmount(
          web3,
          order.takerTokenAmount
        );
        if (txhash) {
          let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
        }
      }

      let txhash = await fillOrderUtil(web3, order);
      let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);

      dispatch(loadTransactions());
    } catch (err) {
      console.warn(err);
      dispatch(setError(err));
    } finally {
      dispatch(notProcessing());
    }
  };
}

export function fillUpToBaseAmount(amount, base, quote, side) {
  return async (dispatch, getState) => {
    dispatch(processing());

    try {
      const {
        wallet: { web3, address },
        relayer: { orders }
      } = getState();
      const zeroEx = await getZeroExClient(web3);
      const tokenAddress = side == 'buy' ? quote.address : base.address;
      let allowance = await getTokenAllowance(web3, tokenAddress);

      // Make sure allowance is available.
      if (allowance.lt(ZeroEx.NULL_ADDRESS)) {
        let txhash = await setTokenUnlimitedAllowance(web3, tokenAddress);
        let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
      }

      // Filter orders until amount is met.
      const fillableOrders = filterAndSortOrdersByTokens(
        orders,
        base,
        quote,
        side
      );
      const ordersToFill = filterOrdersToBaseAmount(
        amount,
        fillableOrders,
        side
      );

      if (!ordersToFill) {
        throw new Error(`Cannot fill orders for unknown side ${side}`);
      }

      // Guarantee WETH is available.
      if (await isWETHAddress(web3, tokenAddress)) {
        let txhash = await guaranteeWETHInWeiAmount(web3, amount);
        if (txhash) {
          let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
          console.log(receipt);
        }
      }

      // Fill orders
      let txhash = await batchFillOrKill(web3, ordersToFill, amount);
      const receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
      console.log(receipt);

      dispatch(loadTransactions());
    } catch (err) {
      console.warn(err);
      dispatch(setError(err));
    } finally {
      dispatch(notProcessing());
    }
  };
}
