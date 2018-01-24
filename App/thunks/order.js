import { ZeroEx } from "0x.js";
import BigNumber from "bignumber.js";
import { signOrder } from "../utils/orders";
import { addErrors, addOrders, addTransactions, startLoading, stopLoading } from "../actions";

export function loadOrders() {
  return async function (dispatch) {
    dispatch(startLoading());

    let res = await fetch("/api/orders");
    let body = await res.json();

    if (res.ok) {
      dispatch(addOrders(body));
    } else {
      dispatch(addErrors([new Error("Could not add orders.")]));
    }

    dispatch(stopLoading());
  }
}

export function createOrder(zeroEx, order, account) {
  return async function (dispatch) {
    let data = new Blob([JSON.stringify(await signOrder(zeroEx, order, account))], {type : "application/json"});
    let res = await fetch("/api/orders", {
      method: "post",
      body
    });

    if (res.ok) {
      return dispatch(loadOrders());
    } else {
      return dispatch(addErrors([new Error("Could not create order.")]));
    }
  }
}

export function fillOrder(zeroEx, order, account) {
  return async (dispatch) => {
    if (!order.hash || !order.signature || !order.salt) {
      return dispatch(addErrors([new Error("Could not fill order. Order is not signed.")]));
    }

    const TX_HASH = await zeroEx.exchange.fillOrderAsync(order, order.takerTokenAmount, true, account.toLowerCase());
    dispatch(addTransactions([ TX_HASH ]));
    // console.warn(TX_HASH);
    // console.warn(await zeroEx.awaitTransactionMinedAsync(TX_HASH));
  }
}
