import { ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import { addActiveTransactions, addAssets, addTransactions } from '../actions';
import EthereumClient from '../clients/ethereum';
import TokenClient from '../clients/token';
import NavigationService from '../services/NavigationService';
import { TransactionService } from '../services/TransactionService';
import * as TokenService from '../services/TokenService';
import * as ZeroExService from '../services/ZeroExService';
import { cache } from '../utils';

export function loadAssets(force = false) {
  return async (dispatch, getState) => {
    const {
      wallet: { web3 },
      relayer: { tokens }
    } = getState();
    const ethereumClient = new EthereumClient(web3);
    const balances = await Promise.all(
      tokens.map(({ address }) => {
        const tokenClient = new TokenClient(ethereumClient, address, force);
        const balance = tokenClient.getBalance();
        return balance;
      })
    );
    const extendedTokens = tokens.map((token, index) => ({
      ...token,
      balance: balances[index]
    }));
    extendedTokens.push({
      address: null,
      symbol: 'ETH',
      name: 'Ether',
      decimals: 18,
      balance: await new EthereumClient(web3).getBalance()
    });
    const assets = extendedTokens.map(({ balance, ...token }) => ({
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
      const txhash = await tokenClient.send(web3, token, to, amount);
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
  return async () => {
    const { address, decimals } = await TokenService.getWETHToken();
    const value = options.wei
      ? new BigNumber(amount)
      : ZeroEx.toBaseUnitAmount(new BigNumber(amount), decimals);

    await ZeroExService.deposit(address, value, options);
  };
}

export function checkAndWrapEther(
  address,
  amount,
  options = { wei: false, batch: false }
) {
  return async () => {
    const weth = await TokenService.getWETHToken();

    if (address === weth.address) {
      await wrapEther(amount, options);
    }
  };
}

export function unwrapEther(amount, options = { wei: false, batch: false }) {
  return async () => {
    const { address, decimals } = await TokenService.getWETHToken();
    const value = options.wei
      ? new BigNumber(amount)
      : ZeroEx.toBaseUnitAmount(new BigNumber(amount), decimals);

    await ZeroExService.withdraw(address, value, options);
  };
}

export function checkAndUnwrapEther(
  address,
  amount,
  options = { wei: false, batch: false }
) {
  return async () => {
    const weth = await TokenService.getWETHToken();

    if (address === weth.address) {
      await unwrapEther(amount, options);
    }
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
    const { decimals } = TokenService.findTokenByAddress(address);
    const amt = options.wei
      ? new BigNumber(amount)
      : ZeroEx.toBaseUnitAmount(new BigNumber(amount), decimals);

    const allowance = await tokenClient.getAllowance();
    if (new BigNumber(amt).gt(allowance)) {
      await ZeroExService.setUnlimitedProxyAllowance(address, options);
    }
  };
}
