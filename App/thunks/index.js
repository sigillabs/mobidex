import { AsyncStorage } from "react-native";
import { Actions } from "react-native-router-flux";
import Wallet from "ethereumjs-wallet";
import { setWallet } from "../actions";
import { loadTokens } from "./ethereum";
export * from "./ethereum";
export * from "./trade";

export function load(store) {
  return async (dispatch) => {
    Actions.loading();

    let { ethereum } = store.getState();
    let { web3 } = ethereum;

    let privateKey = await AsyncStorage.getItem("wallet");
    if (privateKey) {
      let wallet = Wallet.fromPrivateKey(Buffer.from(privateKey, "hex"));
      await dispatch(setWallet(wallet));
      await dispatch(loadTokens(web3));
      Actions.reset("accounts");
    } else {
      Actions.reset("onboarding");
    }
  }
}
