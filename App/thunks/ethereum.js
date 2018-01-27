import * as crypto from "crypto";
import { AsyncStorage } from "react-native";
import Wallet from "ethereumjs-wallet";
import { changeWallet } from "../actions";

// Would like to password protect using Ethereum Secret Storage
// `wallet.toV3("nopass")` is very expensive.
export function generateWallet() {
  return async (dispatch) => {
    let wallet = await Wallet.generate();
    await AsyncStorage.setItem("wallet", wallet.getPrivateKey().toString("hex"));
    changeWallet(wallet);
  };
}
