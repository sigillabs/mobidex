import BigNumber from 'bignumber.js';
import { addActiveTransactions, addAssets, addTransactions } from '../actions';
import {
  asyncTimingWrapper,
  cache,
  getAccount,
  getBalance,
  getTokenBalance,
  getZeroExClient,
  sendTokens as sendTokensUtil,
  sendEther as sendEtherUtil
} from '../utils';
import { gotoErrorScreen } from './navigation';

const getTokenBalanceWithTiming = asyncTimingWrapper(getTokenBalance);

export function updateActiveTransactionCache() {
  return async (dispatch, getState) => {
    const {
      settings,
      wallet: { activeTransactions }
    } = getState();
    await cache(
      `transactions:${settings.network}:active`,
      async () => {
        return activeTransactions;
      },
      0
    );
  };
}

export function loadAssets(force = false) {
  return async (dispatch, getState) => {
    const {
      settings,
      wallet: { web3, address },
      relayer: { tokens }
    } = getState();
    let assets = await cache(
      `assets:${settings.network}`,
      async () => {
        let balances = await Promise.all(
          tokens.map(({ address }) => getTokenBalanceWithTiming(web3, address))
        );
        let extendedTokens = tokens.map((token, index) => ({
          ...token,
          balance: balances[index]
        }));
        extendedTokens.push({
          address: null,
          symbol: 'ETH',
          name: 'Ether',
          decimals: 18,
          balance: await getBalance(web3, address)
        });
        return extendedTokens;
      },
      force ? 0 : 10 * 60
    );

    assets = assets.map(({ balance, ...token }) => ({
      ...token,
      balance: new BigNumber(balance)
    }));

    dispatch(addAssets(assets));
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
              `https://mobidex.io/inf0x/${network}/fills?maker=${address}`,
              options
            ),
            fetch(
              `https://mobidex.io/inf0x/${network}/fills?taker=${address}`,
              options
            ),
            fetch(
              `https://mobidex.io/inf0x/${network}/cancels?maker=${address}`,
              options
            ),
            fetch(
              `https://mobidex.io/inf0x/${network}/deposits?sender=${address}`,
              options
            ),
            fetch(
              `https://mobidex.io/inf0x/${network}/withdrawals?sender=${address}`,
              options
            )
          ];
          const [
            makerFills,
            takerFills,
            makerCancels,
            deposits,
            withdrawals
          ] = await Promise.all(promises);
          const makerFillsJSON = await makerFills.json();
          const takerFillsJSON = await takerFills.json();
          const makerCancelsJSON = await makerCancels.json();
          const depositsJSON = await deposits.json();
          const withdrawalsJSON = await withdrawals.json();
          const filltxs = makerFillsJSON
            .map(log => ({
              ...log,
              id: log.transactionHash,
              status: 'FILLED'
            }))
            .concat(
              takerFillsJSON.map(log => ({
                ...log,
                id: log.transactionHash,
                status: 'FILLED'
              }))
            );
          const canceltxs = makerCancelsJSON.map(log => ({
            ...log,
            id: log.transactionHash,
            status: 'CANCELLED'
          }));
          const depositstxs = depositsJSON.map(log => ({
            ...log,
            id: log.transactionHash,
            status: 'DEPOSITED'
          }));
          const withdrawalstxs = withdrawalsJSON.map(log => ({
            ...log,
            id: log.transactionHash,
            status: 'WITHDRAWAL'
          }));

          return filltxs
            .concat(canceltxs)
            .concat(depositstxs)
            .concat(withdrawalstxs);
        },
        force ? 0 : 10 * 60
      );
      dispatch(addTransactions(transactions));
    } catch (err) {
      dispatch(gotoErrorScreen(err));
    }
  };
}

export function loadActiveTransactions() {
  return async (dispatch, getState) => {
    const { settings } = getState();
    let transactions = await cache(
      `transactions:${settings.network}:active`,
      async () => {
        return [];
      },
      60 * 60 * 24 * 7
    );
    dispatch(addActiveTransactions(transactions));
    dispatch(updateActiveTransactionCache());
  };
}

export function sendTokens(token, to, amount) {
  return async (dispatch, getState) => {
    try {
      const {
        wallet: { web3, address }
      } = getState();
      let zeroEx = await getZeroExClient(web3);
      const txhash = await sendTokensUtil(web3, token, to, amount);
      const activeTransaction = {
        id: txhash,
        type: 'SEND_TOKENS',
        from: address,
        to,
        amount,
        token
      };
      dispatch(addActiveTransactions([activeTransaction]));
      dispatch(updateActiveTransactionCache());
    } catch (err) {
      dispatch(gotoErrorScreen(err));
    }
  };
}

export function sendEther(to, amount) {
  return async (dispatch, getState) => {
    try {
      const {
        wallet: { web3, address }
      } = getState();
      let zeroEx = await getZeroExClient(web3);
      const txhash = await sendEtherUtil(web3, to, amount);
      const activeTransaction = {
        id: txhash,
        type: 'SEND_ETHER',
        address,
        to,
        amount
      };
      dispatch(addActiveTransactions([activeTransaction]));
      dispatch(updateActiveTransactionCache());
    } catch (err) {
      dispatch(gotoErrorScreen(err));
    }
  };
}

export function setTokenAllowance(address) {
  return async (dispatch, getState) => {
    try {
      const {
        wallet: { web3 }
      } = getState();
      const zeroEx = await getZeroExClient(web3);
      const account = await getAccount(web3, address);
      const txhash = await zeroEx.token.setUnlimitedProxyAllowanceAsync(
        address,
        account
      );
      const activeTransaction = {
        id: txhash,
        type: 'ALLOWANCE',
        token: address,
        amount: 'UNLIMITED'
      };
      dispatch(addActiveTransactions([activeTransaction]));
      dispatch(updateActiveTransactionCache());
    } catch (err) {
      dispatch(gotoErrorScreen(err));
    }
  };
}
