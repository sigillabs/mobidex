import * as _ from 'lodash';
import { HttpClient } from '@0xproject/connect';
import { ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { NavigationActions } from 'react-navigation';
import { setError } from '../actions';
import { loadTransactions } from '../thunks';
import {
  cancelOrder as cancelOrderUtil,
  convertLimitOrderToZeroExOrder,
  fillOrder as fillOrderUtil,
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
  setBaseToken,
  setQuoteToken,
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
      dispatch(addOrders([await client.getOrderAsync(signedOrder.orderHash)]));
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
        tokensA.map(token => getTokenByAddress(web3, token.address, force))
      );
      let extTokensB = await Promise.all(
        tokensB.map(token => getTokenByAddress(web3, token.address, force))
      );
      let fullTokensA = tokensA.map((token, index) => ({
        ...token,
        ...extTokensA[index]
      }));
      let fullTokensB = tokensB.map((token, index) => ({
        ...token,
        ...extTokensB[index]
      }));
      let tokens = _.unionBy(fullTokensA, fullTokensB, 'address');
      dispatch(setTokens(tokens));
      dispatch(setProducts(pairs));
      dispatch(setQuoteToken(fullTokensB[0]));
      dispatch(setBaseToken(fullTokensA[0]));
    } catch (err) {
      dispatch(setError(err));
    }
  };
}

export function createSignSubmitOrder(side, price, amount) {
  return async (dispatch, getState) => {
    try {
      dispatch(processing());

      let {
        wallet: { web3, address },
        settings: { relayerEndpoint, quoteToken, baseToken }
      } = getState();
      let zeroEx = await getZeroExClient(web3);
      let relayerClient = new HttpClient(relayerEndpoint);
      let order = {
        ...convertLimitOrderToZeroExOrder(
          quoteToken,
          baseToken,
          side,
          price,
          amount
        ),
        maker: address.toLowerCase(quoteToken, baseToken, side, price, amount),
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
      await dispatch(setError(err));
    } finally {
      dispatch(notProcessing());
      dispatch(NavigationActions.push({ routeName: 'Trading' }));
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
      dispatch(setError(err));
    } finally {
      dispatch(notProcessing());
    }
  };
}
