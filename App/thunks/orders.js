import { ZeroEx } from "0x.js";
import BigNumber from "bignumber.js";
import { HttpClient } from "@0xproject/connect";
import { signOrder } from "../utils/orders";
import { addErrors, addOrders, addTransactions, startLoading, stopLoading } from "../actions";

const BASE_URL = "https://api.radarrelay.com/0x/v0";

export function loadOrders() {
  return async (dispatch) => {
    dispatch(startLoading());

    let client = new HttpClient(BASE_URL);

    try {
      let orders = await client.getOrdersAsync();
      dispatch(addOrders(orders));
    } catch(err) {
      dispatch(addErrors([err]));
    }

    dispatch(stopLoading());
  };
}
