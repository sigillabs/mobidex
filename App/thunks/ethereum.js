import * as _ from "lodash";
import { AsyncStorage } from "react-native";
import Wallet from "ethereumjs-wallet";
import { setWallet, setTokens, setQuoteToken, setBaseToken } from "../actions";
import { getZeroExClient } from "../utils/ethereum";

// Would like to password protect using Ethereum Secret Storage
// `wallet.toV3("nopass")` is very expensive.
export function generateWallet(cb) {
  return async (dispatch) => {
    let wallet = await Wallet.generate();
    await AsyncStorage.setItem("wallet", wallet.getPrivateKey().toString("hex"));
    dispatch(setWallet(wallet));

    if (cb) {
      cb(dispatch);
    }
  };
}

export function loadTokens(web3) {
  return async (dispatch) => {
    let zeroEx = await getZeroExClient(web3);
    let tokens = await zeroEx.tokenRegistry.getTokensAsync();
    dispatch(setTokens(tokens));
    dispatch(setQuoteToken(_.find(tokens, { symbol: "ZRX" })));
    dispatch(setBaseToken(_.reject(tokens, { symbol: "ZRX" })[0]));
  };
}
