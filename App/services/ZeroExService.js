import BigNumber from 'bignumber.js';
import ethUtil from 'ethereumjs-util';
import { ContractDefinitionLoader } from 'web3-contracts-loader';
import {
  addActiveServerTransactions,
  addActiveTransactions
} from '../../actions';
import {
  updateActiveServerTransactionCache,
  updateActiveTransactionCache
} from '../../thunks';
import {
  estimateGas,
  getAccount,
  getNetworkId,
  getTransactionCount,
  getZeroExClient
} from '../../utils';

const TOKEN_ABI = require('../../abi/Token.json');
const WETH_ABI = require('../../abi/WETH9.json');
const EXCHANGE_ABI = require('../../abi/Exchange_v1.json');

let _store;
let _extra_nonce = 0;

async function getTokenContract(address) {
  const {
    wallet: { web3 }
  } = _store.getState();
  const networkId = await getNetworkId(web3);
  return ContractDefinitionLoader({
    web3,
    contractDefinitions: {
      Token: {
        ...TOKEN_ABI,
        networks: {
          [networkId]: {
            address
          }
        }
      }
    },
    options: null
  }).Token;
}

async function getWETHContract(address) {
  const {
    wallet: { web3 }
  } = _store.getState();
  const networkId = await getNetworkId(web3);
  return ContractDefinitionLoader({
    web3,
    contractDefinitions: {
      WETH: {
        ...WETH_ABI,
        networks: {
          [networkId]: {
            address
          }
        }
      }
    },
    options: null
  }).WETH;
}

async function getExchangeV1Contract(address) {
  const {
    wallet: { web3 }
  } = _store.getState();
  const networkId = await getNetworkId(web3);
  return ContractDefinitionLoader({
    web3,
    contractDefinitions: {
      Exchange_v1: {
        ...EXCHANGE_ABI,
        networks: {
          [networkId]: {
            address
          }
        }
      }
    },
    options: null
  }).Exchange_v1;
}

export function setStore(store) {
  _store = store;
}

export async function setUnlimitedProxyAllowance(
  address,
  options = { batch: false }
) {
  const {
    wallet: { web3 },
    settings: { gasPrice, maxGas }
  } = _store.getState();
  const zeroEx = await getZeroExClient(web3);
  const account = await getAccount(web3);

  if (options.batch) {
    const transactionCount = await getTransactionCount(web3, account);
    const contract = await getTokenContract(address);
    const data = contract.approve.getData(
      zeroEx.proxy.getContractAddress(),
      new BigNumber(2).pow(256).minus(1)
    );
    const to = `0x${ethUtil.stripHexPrefix(address.toString().toLowerCase())}`;
    // const gas = await estimateGas(web3, account, to, data);
    const tx = {
      nonce: `0x${new BigNumber(
        (transactionCount + _extra_nonce++) % 0x100
      ).toString(16)}`,
      from: `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`,
      to,
      data,
      gasPrice: `0x${new BigNumber(gasPrice).toString(16)}`,
      gasLimit: `0x${new BigNumber(maxGas).toString(16)}`
    };
    const signedData = web3.signTransaction(tx);
    const activeServerTransaction = {
      type: 'APPROVAL',
      address,
      amount: 'UNLIMITED',
      data: signedData
    };
    _store.dispatch(addActiveServerTransactions([activeServerTransaction]));
    _store.dispatch(updateActiveServerTransactionCache());
  } else {
    const txhash = await zeroEx.token.setUnlimitedProxyAllowanceAsync(
      address,
      account
    );
    const activeTransaction = {
      id: txhash,
      type: 'APPROVAL',
      address,
      amount: 'UNLIMITED'
    };
    _store.dispatch(addActiveTransactions([activeTransaction]));
    _store.dispatch(updateActiveTransactionCache());
  }
}

export async function deposit(address, amount, options = { batch: false }) {
  const {
    wallet: { web3 },
    settings: { gasPrice, maxGas }
  } = _store.getState();
  const zeroEx = await getZeroExClient(web3);
  const account = await getAccount(web3);

  if (options.batch) {
    const transactionCount = await getTransactionCount(web3, account);
    const contract = await getWETHContract(address);
    const data = contract.deposit.getData();
    const to = `0x${ethUtil.stripHexPrefix(address.toString().toLowerCase())}`;
    // const gas = await estimateGas(web3, account, to, data);
    const tx = {
      nonce: `0x${new BigNumber(
        (transactionCount + _extra_nonce++) % 0x100
      ).toString(16)}`,
      from: `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`,
      to,
      value: `0x${new BigNumber(amount).toString(16)}`,
      data,
      gasPrice: `0x${new BigNumber(gasPrice).toString(16)}`,
      gasLimit: `0x${new BigNumber(maxGas).toString(16)}`
    };
    const signedData = web3.signTransaction(tx);
    const activeServerTransaction = {
      type: 'DEPOSIT',
      address,
      amount,
      data: signedData
    };
    _store.dispatch(addActiveServerTransactions([activeServerTransaction]));
    _store.dispatch(updateActiveServerTransactionCache());
  } else {
    const txhash = await zeroEx.etherToken.depositAsync(
      address,
      new BigNumber(amount),
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`
    );
    const activeTransaction = {
      id: txhash,
      type: 'DEPOSIT',
      address,
      amount
    };
    _store.dispatch(addActiveTransactions([activeTransaction]));
    _store.dispatch(updateActiveTransactionCache());
  }
}

export async function withdraw(address, amount, options = { batch: false }) {
  const {
    wallet: { web3 },
    settings: { gasPrice, maxGas }
  } = _store.getState();
  const zeroEx = await getZeroExClient(web3);
  const account = await getAccount(web3);

  if (options.batch) {
    const transactionCount = await getTransactionCount(web3, account);
    const contract = await getWETHContract(address);
    const data = contract.withdraw.getData(new BigNumber(amount));
    const to = `0x${ethUtil.stripHexPrefix(address.toString().toLowerCase())}`;
    // const gas = await estimateGas(web3, account, to, data);
    const tx = {
      nonce: `0x${new BigNumber(
        (transactionCount + _extra_nonce++) % 0x100
      ).toString(16)}`,
      from: `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`,
      to,
      data,
      gasPrice: `0x${new BigNumber(gasPrice).toString(16)}`,
      gasLimit: `0x${new BigNumber(maxGas).toString(16)}`
    };
    const signedData = web3.signTransaction(tx);
    const activeServerTransaction = {
      type: 'WITHDRAWAL',
      address,
      amount,
      data: signedData
    };
    _store.dispatch(addActiveServerTransactions([activeServerTransaction]));
    _store.dispatch(updateActiveServerTransactionCache());
  } else {
    const txhash = await zeroEx.etherToken.withdrawAsync(
      address,
      new BigNumber(amount),
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`
    );
    const activeTransaction = {
      id: txhash,
      type: 'WITHDRAWAL',
      address,
      amount
    };
    _store.dispatch(addActiveTransactions([activeTransaction]));
    _store.dispatch(updateActiveTransactionCache());
  }
}

export async function fillOrder(
  order,
  fillBaseUnitAmount,
  amount,
  options = { batch: false }
) {
  const {
    wallet: { web3 },
    settings: { gasPrice, maxGas }
  } = _store.getState();
  const zeroEx = await getZeroExClient(web3);
  const account = await getAccount(web3);

  if (options.batch) {
    const transactionCount = await getTransactionCount(web3, account);
    const address = zeroEx.exchange.getContractAddress();

    const addresses = [
      order.maker,
      order.taker,
      order.makerTokenAddress,
      order.takerTokenAddress,
      order.feeRecipient
    ];
    const values = [
      new BigNumber(order.makerTokenAmount),
      new BigNumber(order.takerTokenAmount),
      new BigNumber(order.makerFee),
      new BigNumber(order.takerFee),
      new BigNumber(order.expirationUnixTimestampSec),
      new BigNumber(order.salt)
    ];
    const takerAmount = new BigNumber(fillBaseUnitAmount);
    const { v, r, s } = order.ecSignature;

    const contract = await getExchangeV1Contract(address);
    const data = contract.fillOrder.getData(
      addresses,
      values,
      takerAmount,
      true,
      new BigNumber(v),
      new BigNumber(r),
      new BigNumber(s)
    );
    const to = `0x${ethUtil.stripHexPrefix(address.toString().toLowerCase())}`;
    // const gas = await estimateGas(web3, account, to, data);
    const tx = {
      nonce: `0x${new BigNumber(
        (transactionCount + _extra_nonce++) % 0x100
      ).toString(16)}`,
      from: `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`,
      to,
      data,
      gasPrice: `0x${new BigNumber(gasPrice).toString(16)}`,
      gasLimit: `0x${new BigNumber(maxGas).toString(16)}`
    };
    const signedData = web3.signTransaction(tx);
    const activeServerTransaction = {
      ...order,
      type: 'FILL',
      amount,
      data: signedData,
      id: null
    };
    _store.dispatch(addActiveServerTransactions([activeServerTransaction]));
    _store.dispatch(updateActiveServerTransactionCache());
  } else {
    const txhash = await zeroEx.exchange.fillOrderAsync(
      order,
      fillBaseUnitAmount,
      true,
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`,
      { shouldValidate: true }
    );
    const activeTransaction = {
      ...order,
      id: txhash,
      type: 'FILL',
      amount
    };
    _store.dispatch(addActiveTransactions([activeTransaction]));
    _store.dispatch(updateActiveTransactionCache());
  }
}

export async function batchFillOrKill(
  orderRequests,
  amount,
  options = { batch: false }
) {
  const {
    wallet: { web3 },
    settings: { gasPrice, maxGas }
  } = _store.getState();
  const zeroEx = await getZeroExClient(web3);
  const account = await getAccount(web3);

  if (options.batch) {
    const transactionCount = await getTransactionCount(web3, account);
    const address = zeroEx.exchange.getContractAddress();

    const addresses = [];
    const values = [];
    const takerAmounts = [];
    const v = [];
    const r = [];
    const s = [];

    for (const { order, takerTokenFillAmount } of orderRequests) {
      addresses.push([
        order.maker,
        order.taker,
        order.makerToken,
        order.takerToken,
        order.feeRecipient
      ]);
      values.push([
        new BigNumber(order.makerTokenAmount),
        new BigNumber(order.takerTokenAmount),
        new BigNumber(order.makerFee),
        new BigNumber(order.takerFee),
        new BigNumber(order.expirationUnixTimestampSec),
        new BigNumber(order.salt)
      ]);
      takerAmounts.push(new BigNumber(takerTokenFillAmount));
      v.push(order.v);
      r.push(order.r);
      s.push(order.s);
    }

    const contract = await getExchangeV1Contract(address);
    const data = contract.batchFillOrKill.getData(
      addresses,
      values,
      takerAmounts,
      v,
      r,
      s
    );
    const to = `0x${ethUtil.stripHexPrefix(address.toString().toLowerCase())}`;
    // const gas = await estimateGas(web3, account, to, data);
    const tx = {
      nonce: `0x${new BigNumber(
        (transactionCount + _extra_nonce++) % 0x100
      ).toString(16)}`,
      from: `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`,
      to,
      data,
      gasPrice: `0x${new BigNumber(gasPrice).toString(16)}`,
      gasLimit: `0x${new BigNumber(maxGas).toString(16)}`,
      gas: `0x${new BigNumber(maxGas).toString(16)}`
    };
    const signedData = web3.signTransaction(tx);
    const activeServerTransaction = {
      type: 'BATCH_FILL',
      amount,
      data: signedData
    };
    _store.dispatch(addActiveServerTransactions([activeServerTransaction]));
    _store.dispatch(updateActiveServerTransactionCache());
  } else {
    const txhash = await zeroEx.exchange.batchFillOrKillAsync(
      orderRequests,
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`,
      { shouldValidate: true }
    );
    const activeTransaction = {
      id: txhash,
      type: 'BATCH_FILL',
      amount: amount
    };
    _store.dispatch(addActiveTransactions([activeTransaction]));
    _store.dispatch(updateActiveTransactionCache());
  }
}
