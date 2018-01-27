import { AsyncStorage } from "react-native";
import { Actions } from "react-native-router-flux";
import Wallet from "ethereumjs-wallet";
import { changeWallet, startLoading, stopLoading } from "../actions";
import { loadOrders } from "./orders";
export * from "./ethereum";
export * from "./orders";

export function initialLoad() {
  return async (dispatch) => {
    dispatch(startLoading());

    Actions.loading();

    let privateKey = await AsyncStorage.getItem("wallet");
    if (privateKey) {
      let wallet = Wallet.fromPrivateKey(Buffer.from(privateKey, "hex"));
      dispatch(changeWallet(wallet));
      await loadOrders()(dispatch);
      Actions.pop();
      Actions.accounts();
    } else {
      Actions.pop();
      Actions.onboarding();
    }

    dispatch(stopLoading());
  }
}