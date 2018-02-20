import * as _ from "lodash";
import { HttpClient } from "@0xproject/connect";
import { ZeroEx } from "0x.js";
import BigNumber from "bignumber.js";
import moment from "moment";
import { loadTransactions } from "../thunks";
import {
  getZeroExClient,
  getZeroExContractAddress,
  getTokenAllowance,
  getTokenByAddress,
  guaranteeWETHAmount,
  setTokenUnlimitedAllowance,
  isWETHAddress
} from "../utils/ethereum";
import { cancelOrder as cancelOrderUtil, fillOrder as fillOrderUtil, signOrder } from "../utils/orders";
import {
  addErrors,
  addOrders,
  addProcessingOrders,
  removeProcessingOrders,
  setBaseToken,
  setBaseTokens,
  setQuoteToken,
  setQuoteTokens,
  finishedLoadingTokens
} from "../actions";

export function loadOrders() {
  return async (dispatch, getState) => {
    let { settings: { relayerEndpoint } } = getState();
    let client = new HttpClient(relayerEndpoint);

    try {
      dispatch(addOrders(await client.getOrdersAsync()));
      return true;
    } catch(err) {
      dispatch(addErrors([err]));
      return false;
    }
  };
}

export function loadOrder(orderHash) {
  return async (dispatch, getState) => {
    let { settings: { relayerEndpoint } } = getState();
    let client = new HttpClient(relayerEndpoint);

    try {
      dispatch(addOrders([ await client.getOrderAsync(signedOrder.orderHash) ]));
    } catch(err) {
      dispatch(addErrors([err]));
    }
  };
}

export function loadTokens() {
  return async (dispatch, getState) => {
    let { settings: { relayerEndpoint }, wallet: { web3 } } = getState();
    let client = new HttpClient(relayerEndpoint);

    try {
      let pairs = await client.getTokenPairsAsync();
      let tokensA = _.uniqBy(pairs.map(pair => pair.tokenA), "address");
      let tokensB = _.uniqBy(pairs.map(pair => pair.tokenB), "address");
      let baseTokens = await Promise.all(tokensA.map(t => getTokenByAddress(web3, t.address)));
      let quoteTokens = await Promise.all(tokensB.map(t => getTokenByAddress(web3, t.address)));
      dispatch(setBaseTokens(baseTokens))
      dispatch(setBaseToken(baseTokens[0]))
      dispatch(setQuoteTokens(quoteTokens))
      dispatch(setQuoteToken(quoteTokens[0]))
      dispatch(finishedLoadingTokens());
    } catch(err) {
      console.warn(err)
      dispatch(addErrors([err]));
    }
  };
}

export function submitOrder(signedOrder) {
  return async (dispatch, getState) => {
    let { settings: { relayerEndpoint } } = getState();
    let client = new HttpClient(relayerEndpoint);

    try {
      await client.submitOrderAsync(signedOrder);
      await dispatch(loadOrder(signedOrder.orderHash));
    } catch(err) {
      dispatch(addErrors([err]));
    }
  };
}

export function createSignSubmitOrder(price, amount) {
  return async (dispatch, getState) => {
    let { wallet, settings } = getState();
    let web3 = wallet.web3;
    let zeroEx = await getZeroExClient(web3);
    let address = wallet.address.toLowerCase();
    let order = {
      "maker": address,
      "makerFee": new BigNumber(0),
      "makerTokenAddress": settings.quoteToken.address,
      "makerTokenAmount": price.mul(amount),
      "taker": ZeroEx.NULL_ADDRESS,
      "takerFee": new BigNumber(0),
      "takerTokenAddress": settings.baseToken.address,
      "takerTokenAmount": amount,
      "expirationUnixTimestampSec": new BigNumber(moment().unix() + 60*60*24),
      "feeRecipient": ZeroEx.NULL_ADDRESS,
      "salt": ZeroEx.generatePseudoRandomSalt(),
      "exchangeContractAddress": await getZeroExContractAddress(web3)
    };

    // Guarantee WETH is available.
    try {
      if ((await isWETHAddress(web3, order.makerTokenAddress))) {
        await guaranteeWETHAmount(web3, order.makerTokenAmount);
      }
    } catch(err) {
      console.error(err);
      await dispatch(addErrors([err]));
      return false;
    }

    // Make sure allowance is available.
    try {
      let allowance = await getTokenAllowance(web3, order.makerTokenAddress);
      if (order.makerTokenAmount.gt(allowance)) {
        let txhash = await setTokenUnlimitedAllowance(web3, order.makerTokenAddress);
        let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
      }
    } catch(err) {
      console.error(err);
      await dispatch(addErrors([err]));
      return false;
    }

    // Sign
    let signedOrder = await signOrder(web3, order);

    // Submit
    try {
      let client = new HttpClient(settings.relayerEndpoint);
      await client.submitOrderAsync(signedOrder);
    } catch(err) {
      await dispatch(addErrors([err]));
      return false;
    }

    dispatch(addOrders([ signedOrder ]));
    return true;
  };
}

export function cancelOrder(order) {
  return async (dispatch, getState) => {
    let { wallet: { web3 } } = getState();
    let txhash = await cancelOrderUtil(web3, order);
  };
}

export function fillOrder(order) {
  return async (dispatch, getState) => {
    let { wallet: { web3 } } = getState();
    let zeroEx = await getZeroExClient(web3);
    let allowance = await getTokenAllowance(web3, order.takerTokenAddress);
    let fillAmount = new BigNumber(order.takerTokenAmount);

    try {
      dispatch(addProcessingOrders(order.orderHash));

      if (fillAmount.gt(allowance)) {
        let txhash = await setTokenUnlimitedAllowance(web3, order.takerTokenAddress);
        let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
      }

      let txhash = await fillOrderUtil(web3, order);
      let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);

      dispatch(loadTransactions());
    } catch(err) {
      console.error(err);
      dispatch(addErrors([err]));
    } finally {
      dispatch(removeProcessingOrders(order.orderHash));
    }
  };
}
