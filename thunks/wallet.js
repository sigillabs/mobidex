import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { assetDataUtils, BigNumber } from '0x.js';
import * as _ from 'lodash';
import {
  addActiveTransactions,
  addTransactions,
  setAllowances,
  setBalances,
  setWalletAddress
} from '../actions';
import EthereumClient from '../clients/ethereum';
import Inf0xClient from '../clients/inf0x';
import TokenClient from '../clients/token';
import { MAX } from '../constants/0x';
import * as AssetService from '../services/AssetService';
import { setOfflineRoot, showErrorModal } from '../navigation';
import { TransactionService } from '../services/TransactionService';
import { WalletService } from '../services/WalletService';
import { deposit, withdraw } from './0x';

export function loadWalletAddress() {
  return async dispatch => {
    try {
      if (WalletService.instance.isReady) {
        const address = await WalletService.instance.getWalletAddress();
        dispatch(setWalletAddress(address));
      } else {
        dispatch(setWalletAddress(null));
      }
    } catch (error) {
      if (error.message && ~error.message.indexOf('Network is down')) {
        setOfflineRoot();
      } else {
        showErrorModal(error);
      }
    }
  };
}

export function loadAllowances(force = false) {
  return async (dispatch, getState) => {
    const {
      relayer: { assets }
    } = getState();

    try {
      const web3 = WalletService.instance.web3;
      const ethereumClient = new EthereumClient(web3);
      const allowances = await Promise.all(
        assets
          .filter(({ address }) => Boolean(address))
          .map(({ address }) => {
            const tokenClient = new TokenClient(ethereumClient, address);
            return tokenClient
              .getAllowance(null, force)
              .then(allowance => ({ [address]: allowance }));
          })
      );
      const allAllowances = allowances.reduce(
        (acc, obj) => _.merge(acc, obj),
        {}
      );
      dispatch(setAllowances(allAllowances));
    } catch (error) {
      if (error.message && ~error.message.indexOf('Network request failed')) {
        setOfflineRoot();
      } else {
        showErrorModal(error);
      }
    }
  };
}

export function loadAllowance(assetData, force = false) {
  return async dispatch => {
    try {
      const web3 = WalletService.instance.web3;
      const ethereumClient = new EthereumClient(web3);
      const address = assetDataUtils.decodeERC20AssetData(assetData)
        .tokenAddress;
      const tokenClient = new TokenClient(ethereumClient, address);
      const allowance = await tokenClient.getAllowance(null, force);
      dispatch(setAllowances({ [address]: allowance }));
    } catch (error) {
      if (error.message && ~error.message.indexOf('Network request failed')) {
        setOfflineRoot();
      } else {
        showErrorModal(error);
      }
    }
  };
}

export function loadBalances(force = false) {
  return async (dispatch, getState) => {
    const {
      relayer: { assets }
    } = getState();

    try {
      const web3 = WalletService.instance.web3;
      const ethereumClient = new EthereumClient(web3);
      const balances = await Promise.all(
        assets
          .filter(({ address }) => Boolean(address))
          .map(({ address }) => {
            const tokenClient = new TokenClient(ethereumClient, address);
            return tokenClient
              .getBalance(force)
              .then(balance => ({ [address]: balance }));
          })
      );
      const ethereumBalance = await ethereumClient.getBalance(force);
      const allBalances = balances.reduce((acc, obj) => _.merge(acc, obj), {});
      dispatch(setBalances(allBalances));
      dispatch(
        setBalances({
          null: ethereumBalance
        })
      );
    } catch (error) {
      if (error.message && ~error.message.indexOf('Network request failed')) {
        setOfflineRoot();
      } else {
        showErrorModal(error);
      }
    }
  };
}

export function loadBalance(assetData, force = false) {
  return async dispatch => {
    try {
      const web3 = WalletService.instance.web3;
      const ethereumClient = new EthereumClient(web3);
      if (assetData !== null) {
        const address = assetDataUtils.decodeERC20AssetData(assetData)
          .tokenAddress;
        const tokenClient = new TokenClient(ethereumClient, address);
        const balance = await tokenClient.getBalance(force);

        dispatch(setBalances({ [address]: balance }));
      } else {
        const ethereumBalance = await ethereumClient.getBalance(force);

        dispatch(
          setBalances({
            null: ethereumBalance
          })
        );
      }
    } catch (error) {
      if (error.message && ~error.message.indexOf('Network request failed')) {
        setOfflineRoot();
      } else {
        showErrorModal(error);
      }
    }
  };
}

export function loadTransactions(force = false) {
  return async (dispatch, getState) => {
    let {
      settings: { inf0xEndpoint, network }
    } = getState();

    const web3 = WalletService.instance.web3;

    try {
      const ethereumClient = new EthereumClient(web3);
      const inf0xClient = new Inf0xClient(inf0xEndpoint, { network });
      const account = await ethereumClient.getAccount(force);
      const {
        makerFills,
        takerFills,
        makerCancels,
        deposits,
        withdrawals,
        approvals,
        transfers
      } = await inf0xClient.getEvents(account, force);
      const filltxs = (makerFills || [])
        .map(log => ({
          ...log,
          id: log.transactionHash,
          status: 'FILL'
        }))
        .concat(
          (takerFills || []).map(log => ({
            ...log,
            id: log.transactionHash,
            status: 'FILL'
          }))
        );
      const canceltxs = (makerCancels || []).map(log => ({
        ...log,
        id: log.transactionHash,
        status: 'CANCEL'
      }));
      const depositstxs = (deposits || []).map(log => ({
        ...log,
        id: log.transactionHash,
        status: 'DEPOSIT'
      }));
      const withdrawalstxs = (withdrawals || []).map(log => ({
        ...log,
        id: log.transactionHash,
        status: 'WITHDRAWAL'
      }));
      const approvalstxs = (approvals || []).map(log => ({
        ...log,
        id: log.transactionHash,
        type: 'APPROVAL',
        amount: 'UNLIMITED',
        address: log.address
      }));
      const transferstxs = (transfers || []).map(log => ({
        ...log,
        id: log.transactionHash,
        type: 'SEND_TOKENS',
        amount: log.value,
        address: log.address,
        from: log.from,
        to: log.to
      }));

      const alltx = filltxs
        .concat(canceltxs)
        .concat(depositstxs)
        .concat(withdrawalstxs)
        .concat(approvalstxs)
        .concat(transferstxs);

      alltx.sort((txa, txb) => txb.timestamp - txa.timestamp);

      dispatch(addTransactions(alltx));
    } catch (error) {
      if (error.message && ~error.message.indexOf('Network is down')) {
        setOfflineRoot();
      } else {
        showErrorModal(error);
      }
    }
  };
}

export function loadActiveTransactions() {
  return async dispatch => {
    const transactions = await TransactionService.instance.getActiveTransactions();
    dispatch(addActiveTransactions(transactions));
  };
}

export function sendTokens(token, to, amount) {
  return async (dispatch, getState) => {
    const {
      wallet: { address }
    } = getState();

    const web3 = WalletService.instance.web3;

    const ethereumClient = new EthereumClient(web3);
    const tokenClient = new TokenClient(ethereumClient, token.address);
    const txhash = await tokenClient.send(to, amount);
    const activeTransaction = {
      id: txhash,
      type: 'SEND_TOKENS',
      from: address,
      to,
      amount,
      address: token.address
    };
    TransactionService.instance.addActiveTransaction(activeTransaction);
  };
}

export function sendEther(to, amount) {
  return async (dispatch, getState) => {
    const {
      wallet: { address },
      settings: { gasPrice }
    } = getState();

    const web3 = WalletService.instance.web3;

    const ethereumClient = new EthereumClient(web3, { gasPrice });
    const txhash = await ethereumClient.send(to, amount);
    const activeTransaction = {
      id: txhash,
      type: 'SEND_ETHER',
      address,
      to,
      amount
    };
    TransactionService.instance.addActiveTransaction(activeTransaction);
  };
}

export function wrapEther(amount, options = { wei: false, batch: false }) {
  return async dispatch => {
    const { address, decimals } = await AssetService.getWETHAsset();
    const value = options.wei
      ? new BigNumber(amount)
      : Web3Wrapper.toBaseUnitAmount(new BigNumber(amount), decimals);

    await dispatch(deposit(address, value, options));
  };
}

export function checkAndWrapEther(
  address,
  amount,
  options = { wei: false, batch: false }
) {
  return async () => {
    const weth = await AssetService.getWETHAsset();

    if (address === weth.address) {
      await wrapEther(amount, options);
    }
  };
}

export function unwrapEther(amount, options = { wei: false, batch: false }) {
  return async dispatch => {
    const { address, decimals } = await AssetService.getWETHAsset();
    const value = options.wei
      ? new BigNumber(amount)
      : Web3Wrapper.toBaseUnitAmount(new BigNumber(amount), decimals);

    await dispatch(withdraw(address, value, options));
  };
}

export function checkAndUnwrapEther(
  address,
  amount,
  options = { wei: false, batch: false }
) {
  return async () => {
    const weth = await AssetService.getWETHAsset();

    if (address === weth.address) {
      await unwrapEther(amount, options);
    }
  };
}

export function setUnlimitedProxyAllowance(address) {
  return async (dispatch, getState) => {
    const {
      settings: { gasPrice, gasLimit }
    } = getState();

    const web3 = WalletService.instance.web3;

    const ethereumClient = new EthereumClient(web3, {
      gasPrice
    });
    const tokenClient = new TokenClient(ethereumClient, address);
    const txhash = await tokenClient.setUnlimitedProxyAllowance();
    const activeTransaction = {
      id: txhash,
      type: 'APPROVAL',
      address,
      amount: 'UNLIMITED'
    };
    await TransactionService.instance.addActiveTransaction(activeTransaction);
  };
}

export function setNoProxyAllowance(address) {
  return async () => {
    const web3 = WalletService.instance.web3;

    const ethereumClient = new EthereumClient(web3);
    const tokenClient = new TokenClient(ethereumClient, address);
    const txhash = await tokenClient.setProxyAllowance();
    const activeTransaction = {
      id: txhash,
      type: 'APPROVAL',
      address,
      amount: '0'
    };
    await TransactionService.instance.addActiveTransaction(activeTransaction);
  };
}

export function checkAndSetUnlimitedProxyAllowance(address) {
  return async dispatch => {
    const web3 = WalletService.instance.web3;

    const ethereumClient = new EthereumClient(web3);
    const tokenClient = new TokenClient(ethereumClient, address);

    const allowance = await tokenClient.getAllowance(null);
    if (new BigNumber(allowance).lt(MAX)) {
      await dispatch(setUnlimitedProxyAllowance(address));
    }
  };
}
