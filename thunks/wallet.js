import BigNumber from "bignumber.js";
import * as _ from "lodash";
import moment from "moment";
import { AsyncStorage } from "react-native";
import Wallet from "ethereumjs-wallet";
import ethUtil from "ethereumjs-util";
import {
  addAssets,
  addTransactions,
  addProcessing,
  setError,
  setWallet,
  setTransactionHash
} from "../actions";
import {
  getZeroExClient,
  sendTokens as sendTokensUtil,
  sendEther as sendEtherUtil,
  getTokenBalance,
  wrapEther as wrapEtherUtil,
  unwrapEther as unwrapEtherUtil
} from "../utils/ethereum";
import { cache } from "../utils/cache";

// Would like to password protect using Ethereum Secret Storage
export function generateWallet(password) {
  return async (dispatch, getState) => {
    let { settings: { network } } = getState();
    let wallet = await Wallet.generate();
    dispatch(setWallet({ network, wallet }));
    await dispatch(lock(password));
  };
}

export function importPrivateKey(privateKey, password) {
  return async (dispatch, getState) => {
    let { settings: { network } } = getState();
    let wallet = Wallet.fromPrivateKey(Buffer.from(ethUtil.stripHexPrefix(privateKey), "hex"));
    dispatch(setWallet({ network, wallet }));
    await dispatch(lock(password));
  };
}

// export function loadWallet() {
//   return async (dispatch, getState) => {
//     let { settings: { network } } = getState();
//     let privateKey = await AsyncStorage.getItem("wallet");
//     if (privateKey) {
//       let wallet = Wallet.fromPrivateKey(Buffer.from(privateKey, "hex"));
//       dispatch(setWallet({ network, wallet }));
//       return wallet;
//     } else {
//       return null;
//     }
//   };
// }

export function lock(password) {
  return async (dispatch, getState) => {
    let { wallet: { privateKey } } = getState();
    let wallet = Wallet.fromPrivateKey(Buffer.from(ethUtil.stripHexPrefix(privateKey), "hex"));
    let v3 = wallet.toV3(password, { c: 32, n: 32 });
    let json = JSON.stringify(v3);
    await AsyncStorage.setItem("lock", json);
  }
}

export function unlock(password) {
  return async (dispatch, getState) => {
    let { settings: { network } } = getState();
    let v3json = await AsyncStorage.getItem("lock");
    if (v3json) {
      let v3 = JSON.parse(v3json);
      let wallet = Wallet.fromV3(v3, password, { c: 32, n: 32 });
      dispatch(setWallet({ network, wallet }));
    } else {
      throw new Error("Wallet does not exist.");
    }
  }
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
      let filltxs = fillsJSON.hits.hits.map(log => ({
        ...log._source,
        id: log._id,
        status: "FILLED"
      }));
      let canceltxs = cancelsJSON.hits.hits.map(log => ({
        ...log._source,
        id: log._id,
        status: "CANCELLED"
      }));

      dispatch(addTransactions(filltxs.concat(canceltxs)));
    } catch(err) {
      dispatch(setError(err));
    }
  };
}

export function sendTokens(token, to, amount) {
  return async (dispatch, getState) => {
    let { wallet: { web3 } } = getState();
    let zeroEx = await getZeroExClient(web3);
    try {
      let txhash = await sendTokensUtil(web3, token, to, amount);
      dispatch(setTxHash(txhash));
      let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
      await Promise.all([
        dispatch(loadAssets(true)),
        dispatch(loadTransactions(true))
      ]);
    } catch(err) {
      await dispatch(setError(err));
    } finally {
      await dispatch(setTxHash(null));
    }
  };
}

export function sendEther(to, amount) {
  return async (dispatch, getState) => {
    let { wallet: { web3 } } = getState();
    let zeroEx = await getZeroExClient(web3);
    try {
      let txhash = await sendEtherUtil(web3, to, amount);
      dispatch(setTxHash(txhash));
      let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
    } catch(err) {
      await dispatch(setError(err));
    } finally {
      await dispatch(setTxHash(null));
    }
  };
}

export function setTxHash(txhash) {
  return (dispatch) => {
    if (txhash) {
      dispatch(addProcessing([txhash]));
      dispatch(setTransactionHash(txhash));
    } else {
      dispatch(setTransactionHash(null));
    }
  };
}

export function wrapEther(amount) {
  return async (dispatch, getState) => {
    let { wallet: { web3 } } = getState();
    let zeroEx = await getZeroExClient(web3);
    try {
      let txhash = await wrapEtherUtil(web3, amount);
      dispatch(setTxHash(txhash));
      let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
    } catch(err) {
      await dispatch(setError(err));
    } finally {
      await dispatch(setTxHash(null));
    }
  };
}

export function unwrapEther(amount) {
  return async (dispatch, getState) => {
    let { wallet: { web3 } } = getState();
    let zeroEx = await getZeroExClient(web3);
    try {
      let txhash = await unwrapEtherUtil(web3, amount);
      dispatch(setTxHash(txhash));
      let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
    } catch(err) {
      await dispatch(setError(err));
    } finally {
      await dispatch(setTxHash(null));
    }
  };
}
