import * as _ from "lodash";
import { handleActions } from "redux-actions";
import ZeroClientProvider from "web3-provider-engine/zero";
import ProviderEngine from "web3-provider-engine";
import Web3 from "web3";
import ethUtil from "ethereumjs-util";
import sigUtil from "eth-sig-util";
import * as Actions from "../constants/actions";

function getWeb3(privateKey, address) {
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
      const msgSig = ethUtil.ecsign(new Buffer(message, "hex"), new Buffer(ethUtil.stripHexPrefix(privateKey), "hex"));
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

function getInitialState() {
  return {
    privateKey: null,
    address: null,
    web3: null
  };
}

export default handleActions({
  [Actions.SET_WALLET]: (state, action) => {
    let privateKey = `0x${ethUtil.stripHexPrefix(action.payload.getPrivateKey().toString("hex"))}`;
    let address = `0x${ethUtil.stripHexPrefix(action.payload.getAddress().toString("hex"))}`;
    let web3 = getWeb3(privateKey, address);
    return { privateKey, address, web3 };
  }
}, getInitialState());
