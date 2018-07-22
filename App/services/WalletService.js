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

import BigNumber from 'bignumber.js';
import EthTx from 'ethereumjs-tx';
import ethUtil from 'ethereumjs-util';
import sigUtil from 'eth-sig-util';
import * as _ from 'lodash';
import { NativeModules } from 'react-native';
import ZeroClientProvider from 'web3-provider-engine/zero';
import Web3 from 'web3';
import { setWallet } from '../../actions';
import { getURLFromNetwork } from '../../utils';

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
      settings: { network }
    } = _store.getState();

    const exists = await isLocked();
    if (!exists) throw new Error('Wallet does not exist!');

    const privateKey = await getPrivateKey(password);
    const privateKeyBuffer = new Buffer(privateKey, 'hex');
    const addressBuffer = ethUtil.privateToAddress(`0x${privateKey}`);
    const address = ethUtil.stripHexPrefix(addressBuffer.toString('hex'));

    const engine = ZeroClientProvider({
      rpcUrl: getURLFromNetwork(network),
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

export function getAssetByAddress(address) {
  const {
    wallet: { assets }
  } = _store.getState();
  return _.find(assets, { address });
}

export function getAssetBySymbol(symbol) {
  const {
    wallet: { assets }
  } = _store.getState();
  return _.find(assets, { symbol });
}

export function getBalanceByAddress(address) {
  const asset = getAssetByAddress(address);
  if (!asset) return new BigNumber(0);
  if (asset.symbol === 'WETH' || asset.symbol === 'ETH')
    return getEthereumBalance();
  return new BigNumber(asset.balance);
}

export function getBalanceBySymbol(symbol) {
  if (symbol === 'WETH' || symbol === 'ETH') return getEthereumBalance();
  const asset = getAssetBySymbol(symbol);
  if (!asset) return new BigNumber(0);
  return new BigNumber(asset.balance);
}

export function getEthereumBalance() {
  const asset1 = getAssetBySymbol('ETH');
  const asset2 = getAssetBySymbol('WETH');
  let sum = new BigNumber(0);
  if (asset1) sum = sum.add(asset1.balance);
  if (asset2) sum = sum.add(asset2.balance);
  return sum;
}

export function getDecimalsByAddress(address) {
  const asset = getAssetByAddress(address);
  if (!asset) return 0;
  return asset.decimals;
}

export function getDecimalsBySymbol(symbol) {
  const asset = getAssetBySymbol(symbol);
  if (!asset) return 0;
  return asset.decimals;
}
