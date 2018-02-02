import { HttpClient } from "@0xproject/connect";
import { Actions } from "react-native-router-flux";
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
  return async (dispatch) => {
    let client = new HttpClient(BASE_URL);

    try {
      let orders = await client.getOrdersAsync();
      dispatch(addOrders(orders));
    } catch(err) {
      dispatch(addErrors([err]));
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

export function submitOrder(signedOrder) {
  return async (dispatch) => {
    let client = new HttpClient(BASE_URL);
    console.warn(signedOrder);

    try {
      await client.submitOrderAsync(signedOrder);
    } catch(err) {
      console.error(err);
      dispatch(addErrors([err]));
      return;
    }

    dispatch(loadOrder(signedOrder.orderHash));
  };
}
