import * as _ from "lodash";
import { HttpClient } from "@0xproject/connect";
import { ZeroEx } from "0x.js";
import BigNumber from "bignumber.js";
import moment from "moment";
import { NavigationActions } from "react-navigation";
import { setError } from "../actions";
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
import {
  cancelOrder as cancelOrderUtil,
  fillOrder as fillOrderUtil,
  convertLimitOrderToZeroExOrder,
  signOrder
} from "../utils/orders";
import {
  addOrders,
  addProcessingOrders,
  removeProcessingOrders,
  setProducts,
  setBaseToken,
  setQuoteToken,
  setTokens
} from "../actions";

export function loadOrders() {
  return async (dispatch, getState) => {
    let { settings: { relayerEndpoint } } = getState();
    let client = new HttpClient(relayerEndpoint);

    try {
      dispatch(addOrders(await client.getOrdersAsync()));
      return true;
    } catch(err) {
      dispatch(setError(err));
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
      dispatch(setError(err));
    }
  };
}

export function loadProductsAndTokens() {
  return async (dispatch, getState) => {
    let { settings: { relayerEndpoint }, wallet: { web3 } } = getState();
    let client = new HttpClient(relayerEndpoint);

    try {
      let pairs = await client.getTokenPairsAsync();
      let tokensA = await Promise.all(pairs.map(pair => getTokenByAddress(web3, pair.tokenA.address)));
      let tokensB = await Promise.all(pairs.map(pair => getTokenByAddress(web3, pair.tokenB.address)));
      let tokens = _.unionBy(tokensA, tokensB, "address");
      dispatch(setTokens(tokens));
      dispatch(setProducts(pairs));
      dispatch(setQuoteToken(_.find(tokens, { symbol: "WETH" })));
      dispatch(setBaseToken(_.find(tokens, { symbol: "ZRX" })));
    } catch(err) {
      dispatch(setError(err));
    }
  };
}

export function createSignSubmitOrder(side, price, amount) {
  return async (dispatch, getState) => {
    dispatch(NavigationActions.navigate({ routeName: "TransactionsProcessing" }));

    let { wallet: { web3, address }, settings: { relayerEndpoint, quoteToken, baseToken } } = getState();
    let zeroEx = await getZeroExClient(web3);
    let relayerClient = new HttpClient(relayerEndpoint);
    let order = {
      ...convertLimitOrderToZeroExOrder(quoteToken, baseToken, side, price, amount),
      "maker": address.toLowerCase(quoteToken, baseToken, side, price, amount),
      "makerFee": new BigNumber(0),
      "taker": ZeroEx.NULL_ADDRESS,
      "takerFee": new BigNumber(0),
      "expirationUnixTimestampSec": new BigNumber(moment().unix() + 60*60*24),
      "feeRecipient": ZeroEx.NULL_ADDRESS,
      "salt": ZeroEx.generatePseudoRandomSalt(),
      "exchangeContractAddress": await getZeroExContractAddress(web3)
    };
    let allowance = await getTokenAllowance(web3, order.makerTokenAddress);

    try {
      // Guarantee WETH is available.
      if ((await isWETHAddress(web3, order.makerTokenAddress))) {
        await guaranteeWETHAmount(web3, order.makerTokenAmount);
      }

      // Make sure allowance is available.
      if (order.makerTokenAmount.gt(allowance)) {
        let txhash = await setTokenUnlimitedAllowance(web3, order.makerTokenAddress);
        let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
      }

      // Sign
      let signedOrder = await signOrder(web3, order);

      // Submit
      let relayerOrder = await relayerClient.submitOrderAsync(signedOrder);
      console.warn(relayerOrder)

      dispatch(addOrders([ signedOrder ]));
    } catch(err) {
      dispatch(NavigationActions.back());
      await dispatch(setError(err));
    }
  };
}

export function cancelOrder(order) {
  return async (dispatch, getState) => {
    dispatch(NavigationActions.navigate({ routeName: "TransactionsProcessing" }));

    let { wallet: { web3, address } } = getState();

    try {
      if (order.maker !== address) {
        throw new Error("Cannot cancel order that is not yours");
      }

      let txhash = await cancelOrderUtil(web3, order, order.makerTokenAmount);
      let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
    } catch(err) {
      dispatch(NavigationActions.back());
      dispatch(setError(err));
    }
  };
}

export function fillOrder(order) {
  return async (dispatch, getState) => {
    dispatch(NavigationActions.navigate({ routeName: "TransactionsProcessing" }));

    let { wallet: { web3 } } = getState();
    let zeroEx = await getZeroExClient(web3);
    let allowance = await getTokenAllowance(web3, order.takerTokenAddress);
    let fillAmount = new BigNumber(order.takerTokenAmount);

    try {
      if (fillAmount.gt(allowance)) {
        let txhash = await setTokenUnlimitedAllowance(web3, order.takerTokenAddress);
        let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
      }

      let txhash = await fillOrderUtil(web3, order);
      let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);

      dispatch(loadTransactions());
    } catch(err) {
      dispatch(NavigationActions.back());
      dispatch(setError(err));
    }
  };
}
