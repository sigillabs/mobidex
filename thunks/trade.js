import { HttpClient } from "@0xproject/connect";
import { ZeroEx } from "0x.js";
import { Actions } from "react-native-router-flux";
import BigNumber from "bignumber.js";
import moment from "moment";
import { getZeroExContractAddress } from "../utils/ethereum";
import { signOrder } from "../utils/orders";
import { addErrors, addOrders, addTransactions } from "../actions";

// const BASE_URL = "https://api.radarrelay.com/0x/v0";
const BASE_URL = "http://localhost:8000/relayer/v0";

export function gotoOrders() {
  return async (dispatch) => {
    Actions.loading();

    await dispatch(loadOrders());

    Actions.pop();
    Actions.orders();
  };
}

export function loadOrders() {
  return async (dispatch, getState) => {
    let client = new HttpClient(BASE_URL);

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
  return async (dispatch) => {
    let client = new HttpClient(BASE_URL);

    try {
      dispatch(addOrders([ await client.getOrderAsync(signedOrder.orderHash) ]));
    } catch(err) {
      dispatch(addErrors([err]));
    }
  };
}

export function submitOrder(signedOrder, action) {
  return async (dispatch, getState) => {
    let client = new HttpClient(BASE_URL);

    try {
      await client.submitOrderAsync(signedOrder);
      await dispatch(loadOrder(signedOrder.orderHash));
      if (action && Actions[action]) {
        Actions[action]();
      }
    } catch(err) {
      dispatch(addErrors([err]));
    }
  };
}

export function createSignSubmitOrder(web3, price, amount) {
  return async (dispatch, getState) => {
    let { wallet, trade, settings } = getState();
    let address = wallet.address.toLowerCase();
    let order = {
      "maker": `0x${address}`,
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
    let signedOrder = await signOrder(web3, order);
    let client = new HttpClient(BASE_URL);

    try {
      await client.submitOrderAsync(signedOrder);
    } catch(err) {
      await dispatch(addErrors([err]));
      return false;
    }

    dispatch(addOrders([ signedOrder ]));
    return true;
  };
}
