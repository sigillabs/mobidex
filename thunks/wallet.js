import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { BigNumber } from '0x.js';
import * as _ from 'lodash';
import {
  addActiveTransactions,
  addTransactions,
  setAllowances,
  setBalances
} from '../actions';
import EthereumClient from '../clients/ethereum';
import TokenClient from '../clients/token';
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
          .getAllowance(force)
          .then(allowance => ({ [address]: allowance }));
      })
    );
    const allAllowances = allowances.reduce(
      (acc, obj) => _.merge(acc, obj),
      {}
    );

    dispatch(setAllowances(allAllowances));
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
    const allBalances = balances.reduce((acc, obj) => _.merge(acc, obj), {});

    dispatch(setBalances(allBalances));
    dispatch(
      setBalances({
        null: await ethereumClient.getBalance(force)
      })
    );
  };
}

export function loadTransactions(force = false) {
  return async (dispatch, getState) => {
    let {
      wallet: { address },
      settings: { network }
    } = getState();
    try {
      let transactions = await cache(
        `transactions:${network}`,
        async () => {
          let options = {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          };
          let promises = [
            fetch(
              `https://mobidex.io:8443/inf0x/${network}/fills?maker=${address}`,
              options
            ),
            fetch(
              `https://mobidex.io:8443/inf0x/${network}/fills?taker=${address}`,
              options
            ),
            fetch(
              `https://mobidex.io:8443/inf0x/${network}/cancels?maker=${address}`,
              options
            ),
            fetch(
              `https://mobidex.io:8443/inf0x/${network}/deposits?sender=${address}`,
              options
            ),
            fetch(
              `https://mobidex.io:8443/inf0x/${network}/withdrawals?sender=${address}`,
              options
            ),
            fetch(
              `https://mobidex.io:8443/inf0x/${network}/approvals?owner=${address}`,
              options
            )
          ];
          const [
            makerFills,
            takerFills,
            makerCancels,
            deposits,
            withdrawals,
            approvals
          ] = await Promise.all(promises);
          const makerFillsJSON = await makerFills.json();
          const takerFillsJSON = await takerFills.json();
          const makerCancelsJSON = await makerCancels.json();
          const depositsJSON = await deposits.json();
          const withdrawalsJSON = await withdrawals.json();
          const approvalsJSON = await approvals.json();
          const filltxs = makerFillsJSON
            .map(log => ({
              ...log,
              id: log.transactionHash,
              status: 'FILL'
            }))
            .concat(
              takerFillsJSON.map(log => ({
                ...log,
                id: log.transactionHash,
                status: 'FILL'
              }))
            );
          const canceltxs = makerCancelsJSON.map(log => ({
            ...log,
            id: log.transactionHash,
            status: 'CANCEL'
          }));
          const depositstxs = depositsJSON.map(log => ({
            ...log,
            id: log.transactionHash,
            status: 'DEPOSIT'
          }));
          const withdrawalstxs = withdrawalsJSON.map(log => ({
            ...log,
            id: log.transactionHash,
            status: 'WITHDRAWAL'
          }));
          const approvalstxs = approvalsJSON.map(log => ({
            ...log,
            id: log.transactionHash,
            type: 'APPROVAL',
            amount: 'UNLIMITED',
            address: log.address
          }));

          return filltxs
            .concat(canceltxs)
            .concat(depositstxs)
            .concat(withdrawalstxs)
            .concat(approvalstxs);
        },
        force ? 0 : 10 * 60
      );
      dispatch(addTransactions(transactions));
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

export function checkAndSetTokenAllowance(
  address,
  amount,
  options = { wei: false, batch: false }
) {
  return async (dispatch, getState) => {
    const {
      wallet: { web3 }
    } = getState();
    const ethereumClient = new EthereumClient(web3);
    const tokenClient = new TokenClient(ethereumClient, address);
    const asset = AssetService.findAssetByAddress(address);

    if (!asset) {
      throw new Error('Could not find asset');
    }

    const { decimals } = asset;
    const amt = options.wei
      ? new BigNumber(amount)
      : Web3Wrapper.toBaseUnitAmount(new BigNumber(amount), decimals);

    const allowance = await tokenClient.getAllowance();
    if (new BigNumber(amt).gt(allowance)) {
      await dispatch(setUnlimitedProxyAllowance(address));
    }
  };
}
