import BigNumber from 'bignumber.js';
import {
  addActiveTransactions,
  addActiveServerTransactions,
  addAssets,
  addTransactions
} from '../actions';
import {
  asyncTimingWrapper,
  cache,
  createActiveServerTransactions,
  getBalance,
  getTokenBalance,
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

export function updateActiveServerTransactionCache() {
  return async (dispatch, getState) => {
    const {
      settings,
      wallet: { activeServerTransactions }
    } = getState();
    await cache(
      `server-transactions:${settings.network}:active`,
      async () => {
        return activeServerTransactions;
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
            ),
            fetch(
              `https://mobidex.io/inf0x/${network}/approvals?owner=${address}`,
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

export function loadActiveServerTransactions() {
  return async (dispatch, getState) => {
    const { settings } = getState();
    let transactions = await cache(
      `server-transactions:${settings.network}:active`,
      async () => {
        return [];
      },
      60 * 60 * 24 * 7
    );
    dispatch(addActiveServerTransactions(transactions));
    dispatch(updateActiveServerTransactionCache());

    dispatch(pushActiveServerTransactions());
  };
}

export function sendTokens(token, to, amount) {
  return async (dispatch, getState) => {
    try {
      const {
        wallet: { web3, address }
      } = getState();
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

export function pushActiveServerTransactions() {
  return async (dispatch, getState) => {
    try {
      const {
        wallet: { activeServerTransactions }
      } = getState();
      const queued = activeServerTransactions.filter(astx => !astx.id);
      const data = queued.map(astx => astx.data);
      data.reverse(); // Transactions are unioned with new data first.
      const response = await createActiveServerTransactions(data);
      const updated = queued.map(astx => ({ ...astx, id: response.id }));
      dispatch(addActiveServerTransactions(updated));
      dispatch(updateActiveServerTransactionCache());
    } catch (err) {
      dispatch(gotoErrorScreen(err));
    }
  };
}
