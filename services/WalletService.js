// if (opts.getAccounts) self.getAccounts = opts.getAccounts
// // high level override
// if (opts.processTransaction) self.processTransaction = opts.processTransaction
// if (opts.processMessage) self.processMessage = opts.processMessage
// if (opts.processPersonalMessage) self.processPersonalMessage = opts.processPersonalMessage
// if (opts.processTypedMessage) self.processTypedMessage = opts.processTypedMessage
// // approval hooks
// self.approveTransaction = opts.approveTransaction || self.autoApprove
// self.approveMessage = opts.approveMessage || self.autoApprove
// self.approvePersonalMessage = opts.approvePersonalMessage || self.autoApprove
// self.approveTypedMessage = opts.approveTypedMessage || self.autoApprove
// // actually perform the signature
// if (opts.signTransaction) self.signTransaction = opts.signTransaction  || mustProvideInConstructor('signTransaction')
// if (opts.signMessage) self.signMessage = opts.signMessage  || mustProvideInConstructor('signMessage')
// if (opts.signPersonalMessage) self.signPersonalMessage = opts.signPersonalMessage  || mustProvideInConstructor('signPersonalMessage')
// if (opts.signTypedMessage) self.signTypedMessage = opts.signTypedMessage  || mustProvideInConstructor('signTypedMessage')
// if (opts.recoverPersonalSignature) self.recoverPersonalSignature = opts.recoverPersonalSignature
// // publish to network
// if (opts.publishTransaction) self.publishTransaction = opts.publishTransaction

import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { BigNumber } from '0x.js';
import EthTx from 'ethereumjs-tx';
import ethUtil from 'ethereumjs-util';
import sigUtil from 'eth-sig-util';
import * as _ from 'lodash';
import { NativeModules } from 'react-native';
import ZeroClientProvider from 'web3-provider-engine/zero';
import Web3 from 'web3';
import { setWallet } from '../actions';
import { ZERO, MAX } from '../constants/0x';

const WalletManager = NativeModules.WalletManager;

let _store;
let _web3;

export function setStore(store) {
  _store = store;
}

export async function supportsFingerPrintUnlock() {
  return await new Promise((resolve, reject) =>
    WalletManager.supportsFingerPrintAuthentication((err, data) => {
      if (err) return reject(err);
      resolve(data);
    })
  );
}

export async function cancelFingerPrintUnlock() {
  return await new Promise((resolve, reject) =>
    WalletManager.cancelFingerPrintAuthentication((err, data) => {
      if (err) return reject(err);
      resolve(data);
    })
  );
}

export async function isLocked() {
  return await new Promise((resolve, reject) =>
    WalletManager.doesWalletExist((err, data) => {
      if (err) return reject(err);
      resolve(data);
    })
  );
}

export async function getPrivateKey(password) {
  return await new Promise((resolve, reject) =>
    WalletManager.loadWallet(password, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    })
  );
}

export async function getAddress() {
  return _store.getState().wallet.address;
}

export async function lock() {
  _web3 = null;
  await _store.dispatch(setWallet({ web3: null, address: null }));
}

export async function unlock(password = null) {
  if (!_web3) {
    const {
      settings: { ethereumNodeEndpoint }
    } = _store.getState();

    const exists = await isLocked();
    if (!exists) throw new Error('Wallet does not exist!');

    const privateKey = await getPrivateKey(password);
    const privateKeyBuffer = new Buffer(privateKey, 'hex');
    const addressBuffer = ethUtil.privateToAddress(`0x${privateKey}`);
    const address = ethUtil.stripHexPrefix(addressBuffer.toString('hex'));

    const engine = ZeroClientProvider({
      rpcUrl: ethereumNodeEndpoint,
      getAccounts: cb => {
        cb(null, [`0x${address.toLowerCase()}`]);
      },
      signTransaction: (tx, cb) => {
        let ethTx = new EthTx(tx);
        ethTx.sign(privateKeyBuffer);
        return cb(null, `0x${ethTx.serialize().toString('hex')}`);
      },
      processMessage: (params, cb) => {
        const message = ethUtil.stripHexPrefix(params.data);
        const msgSig = ethUtil.ecsign(
          new Buffer(message, 'hex'),
          privateKeyBuffer
        );
        const rawMsgSig = ethUtil.bufferToHex(
          sigUtil.concatSig(msgSig.v, msgSig.r, msgSig.s)
        );
        cb(null, rawMsgSig);
      }
    });

    _web3 = new Web3(engine);

    await _store.dispatch(setWallet({ web3: _web3, address }));
  }

  return _web3;
}

export async function importMnemonics(mnemonics, password) {
  await new Promise((resolve, reject) => {
    WalletManager.importWalletByMnemonics(mnemonics, password, (err, data) => {
      if (err) return reject(reject);
      resolve(data);
    });
  });
  return await unlock(password);
}

export async function generateMnemonics() {
  return await new Promise((resolve, reject) => {
    WalletManager.generateMnemonics((err, data) => {
      if (err) return reject(reject);
      resolve(data);
    });
  });
}

export function getBalanceByAddress(address) {
  const {
    wallet: { balances },
    relayer: { assets }
  } = _store.getState();
  if (!address) {
    if (!balances[null]) {
      return ZERO;
    } else {
      return Web3Wrapper.toUnitAmount(new BigNumber(balances[null]), 18);
    }
  }

  const asset = _.find(assets, { address });
  if (!asset) return ZERO;
  if (!balances[address]) return ZERO;
  return Web3Wrapper.toUnitAmount(
    new BigNumber(balances[address]),
    asset.decimals
  );
}

export function getBalanceBySymbol(symbol) {
  const {
    wallet: { balances },
    relayer: { assets }
  } = _store.getState();
  if (!symbol) return getBalanceByAddress();

  const asset = _.find(assets, { symbol });
  if (!asset) return ZERO;
  if (!balances[asset.address]) return ZERO;
  return Web3Wrapper.toUnitAmount(
    new BigNumber(balances[asset.address]),
    asset.decimals
  );
}

export function getAdjustedBalanceByAddress(address) {
  const {
    relayer: { assets }
  } = _store.getState();
  if (!address) return getFullEthereumBalance();
  const asset = _.find(assets, { address });
  if (!asset) return ZERO;
  if (asset.symbol === 'ETH' || asset.symbol === 'WETH')
    return getFullEthereumBalance();
  return getBalanceByAddress(address);
}

export function getAdjustedBalanceBySymbol(symbol) {
  if (symbol === 'WETH' || symbol === 'ETH') return getFullEthereumBalance();
  return getBalanceBySymbol(symbol);
}

export function getFullEthereumBalance() {
  return getBalanceBySymbol('ETH').add(getBalanceBySymbol('WETH'));
}

export function getAllowanceByAddress(address) {
  const {
    wallet: { allowances },
    relayer: { assets }
  } = _store.getState();
  if (!address) {
    return ZERO;
  }

  const asset = _.find(assets, { address });
  if (!asset) return ZERO;
  if (!allowances[address]) return ZERO;
  return Web3Wrapper.toUnitAmount(
    new BigNumber(allowances[address]),
    asset.decimals
  );
}

export function getAllowanceBySymbol(symbol) {
  const {
    wallet: { allowances },
    relayer: { assets }
  } = _store.getState();
  if (!symbol) return ZERO;

  const asset = _.find(assets, { symbol });
  if (!asset) return ZERO;
  if (!allowances[asset.address]) return ZERO;
  return Web3Wrapper.toUnitAmount(
    new BigNumber(allowances[asset.address]),
    asset.decimals
  );
}

export function isUnlockedByAddress(address) {
  const {
    wallet: { allowances },
    relayer: { assets }
  } = _store.getState();
  if (!address) {
    return false;
  }

  const asset = _.find(assets, { address });
  if (!asset) return false;
  if (!allowances[address]) return false;
  return MAX.eq(allowances[address]);
}

export function isUnlockedBySymbol(symbol) {
  const {
    wallet: { allowances },
    relayer: { assets }
  } = _store.getState();
  if (!symbol) {
    return false;
  }

  const asset = _.find(assets, { symbol });
  if (!asset) return false;
  if (!allowances[asset.address]) return false;
  return MAX.eq(allowances[asset.address]);
}

export function getDecimalsByAddress(address) {
  const {
    relayer: { assets }
  } = _store.getState();
  const asset = _.find(assets, { address });
  if (!asset) return 0;
  return asset.decimals;
}

export function getDecimalsBySymbol(symbol) {
  const {
    relayer: { assets }
  } = _store.getState();
  const asset = _.find(assets, { symbol });
  if (!asset) return 0;
  return asset.decimals;
}
