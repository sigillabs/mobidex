import BigNumber from "bignumber.js";
import * as _ from "lodash";
import moment from "moment";
import { AsyncStorage } from "react-native";
import Wallet from "ethereumjs-wallet";
import { addAssets, addTransactions, setWallet, finishedLoadingWallet } from "../actions";
import { getTokenBalance } from "../utils/ethereum";
import { cache } from "../utils/cache";

// Would like to password protect using Ethereum Secret Storage
// `wallet.toV3("nopass")` is very expensive.
export function generateWallet() {
  return async (dispatch, getState) => {
    let { settings: { network } } = getState();
    let wallet = await Wallet.generate();
    await AsyncStorage.setItem("wallet", wallet.getPrivateKey().toString("hex"));
    dispatch(setWallet({network, wallet}));
  };
}

export function loadWallet() {
  return async (dispatch, getState) => {
    let { settings: { network } } = getState();
    let privateKey = await AsyncStorage.getItem("wallet");
    if (privateKey) {
      let wallet = Wallet.fromPrivateKey(Buffer.from(privateKey, "hex"));
      dispatch(setWallet({network, wallet}));
      dispatch(finishedLoadingWallet());
      return wallet;
    } else {
      return null;
    }
  };
}

export function loadAssets(force = false) {
  return async (dispatch, getState) => {
    let assets = await cache("assets", async () => {
      let { wallet: { web3 }, relayer: { tokens } } = getState();
      let balances = await Promise.all(tokens.map(({ address }) => (getTokenBalance(web3, address))));
      return tokens.map((token, index) => ({ ...token, balance: balances[index] }));
    }, force ? 0 : 60);

    assets = assets.map(({ balance, ...token }) => ({ ...token, balance: new BigNumber(balance) }))

    dispatch(addAssets(assets));
    return assets;
  };
}

export function loadTransactions() {
  return async (dispatch, getState) => {
    let { wallet: { address } } = getState();
    try {
      let options = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      };
      let promises = [
        fetch(`http://inf0x.com:9200/0x-kovan-fills/logs/_search?q=maker:${address}%20OR%20taker:${address}`, options),
        fetch(`http://inf0x.com:9200/0x-kovan-cancels/logs/_search?q=maker:${address}%20OR%20taker:${address}`, options)
      ];
      let [ fills, cancels ] = await Promise.all(promises);
      let fillsJSON = await fills.json();
      let cancelsJSON = await cancels.json();
      dispatch(addTransactions(fillsJSON.hits.hits.map(log => ({
        ...log._source,
        id: log._id,
        status: "FILLED"
      }))));
      dispatch(addTransactions(cancelsJSON.hits.hits.map(log => ({
        ...log._source,
        id: log._id,
        status: "CANCELLED"
      }))));
    } catch(err) {
      console.error(err)
    }
  };
}

export function sendTokens(token, to, amount) {
  return async (dispatch, getState) => {
    let { wallet: { address } } = getState();
    
  };
}

export function sendEther(to, amount) {
  return async (dispatch, getState) => {
    let { wallet: { address } } = getState();
    
  };
}
