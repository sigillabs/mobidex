import * as _ from "lodash";
import { handleActions } from "redux-actions";
import ZeroClientProvider from "web3-provider-engine/zero";
import ProviderEngine from "web3-provider-engine";
import Web3 from "web3";
import ethUtil from "ethereumjs-util";
import sigUtil from "eth-sig-util";
import * as Actions from "../constants/actions";

function getInitialState() {
  const engine = ZeroClientProvider({
    rpcUrl: "https://kovan.infura.io/",
    getAccounts: (cb) => {
      cb(null, [ `0x${state.wallet.getAddress().toString("hex").toLowerCase()}` ]);
    },
    // tx signing
    processTransaction: (params, cb) => {
      console.warn("processTransaction", params);
      cb(null, null);
    },
    // old style msg signing
    processMessage: (params, cb) => {
      const message = ethUtil.stripHexPrefix(params.data);
      const msgSig = ethUtil.ecsign(new Buffer(message, 'hex'), state.wallet.getPrivateKey());
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
  const web3 = new Web3(engine);
  const state = {
    wallet: null,
    web3: web3,
    active: true,
    transactions: [],
    tokens: []
  };

  return state;
}

export default handleActions({
  [Actions.ADD_TRANSACTIONS]: (state, action) => {
    state.transactions = _.union(state.transactions, action.payload);
    return state;
  },
  [Actions.SET_WALLET]: (state, action) => {
    if (action.payload) {
      state.wallet = action.payload;
    } else {
      state.wallet = null;
    }
    return state;
  },
  [Actions.SET_TOKENS]: (state, action) => {
    state.tokens = action.payload;
    return state;
  }
}, getInitialState());
