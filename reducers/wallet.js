import * as _ from 'lodash';
import { handleActions } from 'redux-actions';
import ZeroClientProvider from 'web3-provider-engine/zero';
import ProviderEngine from 'web3-provider-engine';
import Web3 from 'web3';
import EthTx from 'ethereumjs-tx';
import ethUtil from 'ethereumjs-util';
import sigUtil from 'eth-sig-util';
import * as Actions from '../constants/actions';
import { getURLFromNetwork } from '../utils/ethereum';

function getWeb3 (network, privateKey, address) {
  const engine = ZeroClientProvider({
    rpcUrl: getURLFromNetwork(network),
    getAccounts: (cb) => {
      cb(null, [ address.toString('hex').toLowerCase() ]);
    },
    // tx signing
    // processTransaction: (params, cb) => {
    //   console.warn("processTransaction", params);
    //   cb(null, null);
    // },
    signTransaction: (tx, cb) => {
      let ethTx = new EthTx(tx);
      ethTx.sign(new Buffer(ethUtil.stripHexPrefix(privateKey), 'hex'));
      // ethTx.sign(`0x${ethUtil.stripHexPrefix(privateKey)}`);
      // console.error(ethTx.serialize().toString("hex"));
      return cb(null, `0x${ethTx.serialize().toString('hex')}`);
    },
    // old style msg signing
    processMessage: (params, cb) => {
      const message = ethUtil.stripHexPrefix(params.data);
      const msgSig = ethUtil.ecsign(new Buffer(message, 'hex'), new Buffer(ethUtil.stripHexPrefix(privateKey), 'hex'));
      const rawMsgSig = ethUtil.bufferToHex(sigUtil.concatSig(msgSig.v, msgSig.r, msgSig.s));
      cb(null, rawMsgSig);
    },
    // personal_sign msg signing
    processPersonalMessage: (params, cb) => {
      console.warn('processPersonalMessage', params);
      cb(null, null);
    },
    processTypedMessage: (params, cb) => {
      console.warn('processTypedMessage', params);
      cb(null, null);
    }
  });
  return new Web3(engine);
}

const initialState = {
  web3: null,
  privateKey: null,
  address: null,
  assets: [],
  transactions: [],
  processing: false
};

export default handleActions({
  [Actions.ADD_ASSETS]: (state, action) => {
    let assets = _.unionBy(action.payload, state.assets, 'address');
    return { ...state, assets };
  },
  [Actions.PROCESSING]: (state) => {
    return { ...state, processing: true };
  },
  [Actions.NOT_PROCESSING]: (state) => {
    return { ...state, processing: false };
  },
  [Actions.ADD_TRANSACTIONS]: (state, action) => {
    let transactions = _.unionBy(action.payload, state.transactions, 'id');
    return { ...state, transactions };
  },
  [Actions.SET_WALLET]: (state, action) => {
    let { network, wallet } = action.payload;
    let privateKey = `0x${ethUtil.stripHexPrefix(wallet.getPrivateKey().toString('hex'))}`;
    let address = `0x${ethUtil.stripHexPrefix(wallet.getAddress().toString('hex'))}`;
    let web3 = getWeb3(network, privateKey, address);
    return { ...state, privateKey, address, web3 };
  }
}, initialState);
