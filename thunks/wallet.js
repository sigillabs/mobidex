import * as _ from "lodash";
import moment from "moment";
import { AsyncStorage } from "react-native";
import Wallet from "ethereumjs-wallet";
import {
  addAssets,
  addTransactions,
  setWallet,
  setTokens,
  setQuoteToken,
  setBaseToken,
  finishedLoadingTokens,
  finishedLoadingWallet
} from "../actions";
import { getTokenBalance } from "../utils/ethereum";
import { cache } from "../utils/cache";

// Would like to password protect using Ethereum Secret Storage
// `wallet.toV3("nopass")` is very expensive.
export function generateWallet() {
  return async (dispatch) => {
    let wallet = await Wallet.generate();
    await AsyncStorage.setItem("wallet", wallet.getPrivateKey().toString("hex"));
    dispatch(setWallet(wallet));
  };
}

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

export function loadAssets(cache = true) {
  return async (dispatch, getState) => {
    let assets = await cache("assets", async () => {
      let { wallet: { web3 }, settings: { tokens } } = getState();
      let balances = await Promise.all(tokens.map(({ address }) => (getTokenBalance(address))));
      return tokens.map((token, index) => ({ ...token, balance: balances[index] }));
    });

    dispatch(addAssets(assets));
    return assets;
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
