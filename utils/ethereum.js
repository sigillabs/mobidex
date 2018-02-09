import { ZeroEx } from "0x.js";
import ethUtil from "ethereumjs-util";
import sigUtil from "eth-sig-util";
import * as _ from "lodash";
import { handleActions } from "redux-actions";
import Web3 from "web3";
import ZeroClientProvider from "web3-provider-engine/zero";
import ProviderEngine from "web3-provider-engine";
import * as Actions from "../constants/actions";

export function getWeb3(privateKey, address) {
  const engine = ZeroClientProvider({
    rpcUrl: "https://kovan.infura.io/",
    getAccounts: (cb) => {
      cb(null, [ address.toString("hex").toLowerCase() ]);
    },
    // tx signing
    processTransaction: (params, cb) => {
      console.warn("processTransaction", params);
      cb(null, null);
    },
    // old style msg signing
    processMessage: (params, cb) => {
      const message = ethUtil.stripHexPrefix(params.data);
      const msgSig = ethUtil.ecsign(new Buffer(message, 'hex'), privateKey);
      const rawMsgSig = ethUtil.bufferToHex(sigUtil.concatSig(msgSig.v, msgSig.r, msgSig.s));
      cb(null, rawMsgSig);
    },
    // personal_sign msg signing
    processPersonalMessage: (params, cb) => {
      console.warn("processPersonalMessage", params);
      cb(null, null);
    },
    processTypedMessage: (params, cb) => {
      console.warn("processTypedMessage", params);
      cb(null, null);
    }
  });
  return new Web3(engine);
}

export async function getNetworkId(web3) {
  return await new Promise((resolve, reject) => {
    web3.version.getNetwork((err, network) => {
      if (err) {
        reject(err);
      } else {
        resolve(parseInt(network));
      }
    });
  });
}

export async function getAccount(web3) {
  return await new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, accounts) => {
      if (err) {
        reject(err);
      } else {
        resolve(accounts[0]);
      }
    });
  });
}

export async function getZeroExClient(web3) {
  return new ZeroEx(web3.currentProvider, { networkId: await getNetworkId(web3) });
}

export async function getZeroExContractAddress(web3) {
  let zeroEx = await getZeroExClient(web3);
  return await zeroEx.exchange.getContractAddress();
}

export async function getZeroExTokens(web3) {
  let zeroEx = await getZeroExClient(web3);
  return await zeroEx.tokenRegistry.getTokensAsync();
}
