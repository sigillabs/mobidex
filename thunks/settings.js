import * as _ from "lodash";
import { AsyncStorage } from "react-native";
import Wallet from "ethereumjs-wallet";
import { setWallet, setTokens, setQuoteToken, setBaseToken, finishedLoadingTokens, finishedLoadingWallet } from "../actions";
import { getZeroExClient, getZeroExTokens } from "../utils/ethereum";
import { cache } from "../utils/cache";

export function loadTokens() {
  return async (dispatch, getState) => {
    let tokens = await cache("tokens", async () => {
      let { wallet: { web3 } } = getState();
      return await getZeroExTokens(web3);
    });

    dispatch(setTokens(tokens));
    dispatch(setQuoteToken(_.find(tokens, { symbol: "WETH" })));
    dispatch(setBaseToken(_.find(tokens, { symbol: "ZRX" })));
    dispatch(finishedLoadingTokens());

    return tokens;
  };
}
