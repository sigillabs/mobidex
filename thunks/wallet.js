import BigNumber from "bignumber.js";
import { AsyncStorage, Linking } from "react-native";
import Wallet from "ethereumjs-wallet";
import ethUtil from "ethereumjs-util";
import {
  addAssets,
  addTransactions,
  notProcessing,
  processing,
  setError,
  setWallet
} from "../actions";
import { getNetworkId, getZeroExClient } from "../utils/ethereum";
import {
  getBalance,
  sendTokens as sendTokensUtil,
  sendEther as sendEtherUtil,
  getTokenBalance,
  wrapEther as wrapEtherUtil,
  unwrapEther as unwrapEtherUtil
} from "../utils/tokens";
import { cache } from "../utils/cache";
import { fromV3, toV3 } from "../utils/crypto";

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

export function lock(password) {
  return async (dispatch, getState) => {
    let { wallet: { privateKey, address } } = getState();
    let v3 = await toV3(ethUtil.stripHexPrefix(privateKey), ethUtil.stripHexPrefix(address), password);
    let json = JSON.stringify(v3);
    await AsyncStorage.setItem("lock", json);
  };
}

export function unlock(password) {
  return async (dispatch, getState) => {
    let { settings: { network } } = getState();
    let v3json = await AsyncStorage.getItem("lock");
    if (v3json) {
      let v3 = JSON.parse(v3json);
      let walletobj = await fromV3(v3, password);
      let wallet = Wallet.fromPrivateKey(Buffer.from(ethUtil.stripHexPrefix(walletobj.privateKey), "hex"));
      dispatch(setWallet({ network, wallet }));
    } else {
      throw new Error("Wallet does not exist.");
    }
  };
}

export function loadAssets(force = false) {
  return async (dispatch, getState) => {
    let { wallet: { web3, address }, relayer: { tokens } } = getState();
    let assets = await cache("assets", async () => {
      let balances = await Promise.all(tokens.map(({ address }) => (getTokenBalance(web3, address))));
      let extendedTokens = tokens.map((token, index) => ({ ...token, balance: balances[index] }));
      extendedTokens.push({
        address: null,
        symbol: "ETH",
        name: "Ether",
        decimals: 18,
        balance: await getBalance(web3, address)
      });
      return extendedTokens;
    }, force ? 0 : 60);

    assets = assets.map(({ balance, ...token }) => ({ ...token, balance: new BigNumber(balance) }));

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
        fetch(`http://inf0x.com:9200/0x-kovan-fills/logs/_search?q=maker:${address}%20OR%20taker:${address}&sort=timestamp:desc`, options),
        fetch(`http://inf0x.com:9200/0x-kovan-cancels/logs/_search?q=maker:${address}%20OR%20taker:${address}&sort=timestamp:desc`, options)
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
    try {
      dispatch(processing());

      let { wallet: { web3 } } = getState();
      let zeroEx = await getZeroExClient(web3);
      let txhash = await sendTokensUtil(web3, token, to, amount);
      let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
      await Promise.all([
        dispatch(loadAssets(true)),
        dispatch(loadTransactions(true))
      ]);
    } catch(err) {
      await dispatch(setError(err));
    } finally {
      dispatch(notProcessing());
    }
  };
}

export function sendEther(to, amount) {
  return async (dispatch, getState) => {
    try {
      dispatch(processing());

      let { wallet: { web3 } } = getState();
      let zeroEx = await getZeroExClient(web3);
      let txhash = await sendEtherUtil(web3, to, amount);
      let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
    } catch(err) {
      await dispatch(setError(err));
    } finally {
      dispatch(notProcessing());
    }
  };
}

export function wrapEther(amount) {
  return async (dispatch, getState) => {
    try {
      dispatch(processing());

      let { wallet: { web3 } } = getState();
      let zeroEx = await getZeroExClient(web3);
      let txhash = await wrapEtherUtil(web3, amount);
      let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
    } catch(err) {
      await dispatch(setError(err));
    } finally {
      dispatch(notProcessing());
    }
  };
}

export function unwrapEther(amount) {
  return async (dispatch, getState) => {
    try {
      dispatch(processing());

      let { wallet: { web3 } } = getState();
      let zeroEx = await getZeroExClient(web3);
      let txhash = await unwrapEtherUtil(web3, amount);
      let receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
    } catch(err) {
      await dispatch(setError(err));
    } finally {
      dispatch(notProcessing());
    }
  };
}

export function gotoEtherScan(txaddr) {
  return async (dispatch, getState) => {
    let { wallet: { web3 } } = getState();
    let networkId = await getNetworkId(web3);
    switch(networkId) {
    case 42:
      return await Linking.openURL(`https://kovan.etherscan.io/tx/${txaddr}`);

    default:
      return await Linking.openURL(`https://etherscan.io/txs/${txaddr}`);
    }
  };
}
