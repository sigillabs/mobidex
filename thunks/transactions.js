import { AsyncStorage } from "react-native";
import Wallet from "ethereumjs-wallet";
import { setTransactions } from "../actions";
import { getZeroExLogs } from "../utils/ethereum";

// Would like to password protect using Ethereum Secret Storage
// `wallet.toV3("nopass")` is very expensive.
export function generateWallet() {
  return async (dispatch) => {
    let wallet = await Wallet.generate();
    await AsyncStorage.setItem("wallet", wallet.getPrivateKey().toString("hex"));
    dispatch(setWallet(wallet));
  };
}

export function loadTransactions() {
  return async (dispatch, getState) => {
    // Need index of 0x.
    // let client = new HttpClient(BASE_URL);

    // try {
    //   dispatch(addOrders(await client.getOrdersAsync()));
    //   return true;
    // } catch(err) {
    //   dispatch(addErrors([err]));
    //   return false;
    // }
  };
}

export function saveTransactions() {

}
