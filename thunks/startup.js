import * as _ from "lodash";
import { AsyncStorage } from "react-native";
import Wallet from "ethereumjs-wallet";
import { setWallet, setTokens, setQuoteToken, setBaseToken, finishedLoadingTokens, finishedLoadingWallet } from "../actions";
import { getZeroExClient } from "../utils/ethereum";

export function loadWallet() {
  return async (dispatch) => {
    let privateKey = await AsyncStorage.getItem("wallet");
    if (privateKey) {
      let wallet = Wallet.fromPrivateKey(Buffer.from(privateKey, "hex"));
      dispatch(setWallet(wallet));
      dispatch(finishedLoadingWallet());
      return wallet;
    } else {
      return null;
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
    dispatch(finishedLoadingTokens());
  };
}
