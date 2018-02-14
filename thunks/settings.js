import * as _ from "lodash";
import { AsyncStorage } from "react-native";
import Wallet from "ethereumjs-wallet";
import { setWallet, setTokens, setQuoteToken, setBaseToken, finishedLoadingTokens, finishedLoadingWallet } from "../actions";
import { getZeroExClient } from "../utils/ethereum";

export function loadTokens() {
  return async (dispatch, getState) => {
    let { wallet: { web3 } } = getState();
    let zeroEx = await getZeroExClient(web3);
    let tokens = await zeroEx.tokenRegistry.getTokensAsync();
    dispatch(setTokens(tokens));
    dispatch(setQuoteToken(_.find(tokens, { symbol: "ZRX" })));
    dispatch(setBaseToken(_.reject(tokens, { symbol: "ZRX" })[0]));
    dispatch(finishedLoadingTokens());
  };
}
