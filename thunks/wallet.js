import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { BigNumber } from '0x.js';
import * as _ from 'lodash';
import { InteractionManager } from 'react-native';
import {
  addActiveTransactions,
  addTransactions,
  setAllowances,
  setBalances
} from '../actions';
import EthereumClient from '../clients/ethereum';
import Inf0xClient from '../clients/inf0x';
import TokenClient from '../clients/token';
import { MAX } from '../constants/0x';
import * as AssetService from '../services/AssetService';
import NavigationService from '../services/NavigationService';
import { TransactionService } from '../services/TransactionService';
import { cache } from '../utils';
import { deposit, withdraw } from './0x';

export function loadAllowances(force = false) {
  return async (dispatch, getState) => {
    const {
      wallet: { web3 },
      relayer: { assets }
    } = getState();
    const ethereumClient = new EthereumClient(web3);
    const allowances = await Promise.all(
      assets.filter(({ address }) => Boolean(address)).map(({ address }) => {
        const tokenClient = new TokenClient(ethereumClient, address);
        return tokenClient
          .getAllowance(null, force)
          .then(allowance => ({ [address]: allowance }));
      })
    );

    InteractionManager.runAfterInteractions(() => {
      const allAllowances = allowances.reduce(
        (acc, obj) => _.merge(acc, obj),
        {}
      );

      dispatch(setAllowances(allAllowances));
    });
  };
}

export function loadBalances(force = false) {
  return async (dispatch, getState) => {
    const {
      wallet: { web3 },
      relayer: { assets }
    } = getState();
    const ethereumClient = new EthereumClient(web3);
    const balances = await Promise.all(
      assets.filter(({ address }) => Boolean(address)).map(({ address }) => {
        const tokenClient = new TokenClient(ethereumClient, address);
        return tokenClient
          .getBalance(force)
          .then(balance => ({ [address]: balance }));
      })
    );
    const ethereumBalance = await ethereumClient.getBalance(force);

    InteractionManager.runAfterInteractions(() => {
      const allBalances = balances.reduce((acc, obj) => _.merge(acc, obj), {});
      dispatch(setBalances(allBalances));
      dispatch(
        setBalances({
          null: ethereumBalance
        })
      );
    });
  };
}

export function loadTransactions(force = false) {
  return async (dispatch, getState) => {
    let {
      wallet: { web3 },
      settings: { inf0xEndpoint, network }
    } = getState();
    try {
      let transactions = await cache(
        `transactions:${network}`,
        async () => {
          const ethereumClient = new EthereumClient(web3);
          const inf0xClient = new Inf0xClient(inf0xEndpoint, { network });
          const account = await ethereumClient.getAccount(force);
          const {
            makerFills,
            takerFills,
            makerCancels,
            deposits,
            withdrawals,
            approvals
          } = await inf0xClient.getEvents(account, force);
          const filltxs = makerFills
            .map(log => ({
              ...log,
              id: log.transactionHash,
              status: 'FILL'
            }))
            .concat(
              takerFills.map(log => ({
                ...log,
                id: log.transactionHash,
                status: 'FILL'
              }))
            );
          const canceltxs = makerCancels.map(log => ({
            ...log,
            id: log.transactionHash,
            status: 'CANCEL'
          }));
          const depositstxs = deposits.map(log => ({
            ...log,
            id: log.transactionHash,
            status: 'DEPOSIT'
          }));
          const withdrawalstxs = withdrawals.map(log => ({
            ...log,
            id: log.transactionHash,
            status: 'WITHDRAWAL'
          }));
          const approvalstxs = approvals.map(log => ({
            ...log,
            id: log.transactionHash,
            type: 'APPROVAL',
            amount: 'UNLIMITED',
            address: log.address
          }));

          const alltx = filltxs
            .concat(canceltxs)
            .concat(depositstxs)
            .concat(withdrawalstxs)
            .concat(approvalstxs);

          alltx.sort((txa, txb) => txb.timestamp - txa.timestamp);

          return alltx;
        },
        force ? 0 : 10 * 60
      );
      InteractionManager.runAfterInteractions(() => {
        dispatch(addTransactions(transactions));
      });
    } catch (err) {
      NavigationService.error(err);
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
    try {
      const {
        wallet: { web3, address }
      } = getState();
      const ethereumClient = new EthereumClient(web3);
      const tokenClient = new TokenClient(ethereumClient, token.address);
      const txhash = await tokenClient.send(to, amount);
      const activeTransaction = {
        id: txhash,
        type: 'SEND_TOKENS',
        from: address,
        to,
        amount,
        token
      };
      TransactionService.instance.addActiveTransaction(activeTransaction);
    } catch (err) {
      NavigationService.error(err);
    }
  };
}

export function sendEther(to, amount) {
  return async (dispatch, getState) => {
    try {
      const {
        wallet: { web3, address }
      } = getState();
      const ethereumClient = new EthereumClient(web3);
      const txhash = await ethereumClient.send(to, amount);
      const activeTransaction = {
        id: txhash,
        type: 'SEND_ETHER',
        address,
        to,
        amount
      };
      TransactionService.instance.addActiveTransaction(activeTransaction);
    } catch (err) {
      NavigationService.error(err);
    }
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
      wallet: { web3 }
    } = getState();
    const ethereumClient = new EthereumClient(web3);
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
  return async (dispatch, getState) => {
    const {
      wallet: { web3 }
    } = getState();
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
  return async (dispatch, getState) => {
    const {
      wallet: { web3 }
    } = getState();
    const ethereumClient = new EthereumClient(web3);
    const tokenClient = new TokenClient(ethereumClient, address);

    const allowance = await tokenClient.getAllowance(null);
    if (new BigNumber(allowance).lt(MAX)) {
      await dispatch(setUnlimitedProxyAllowance(address));
    }
  };
}
