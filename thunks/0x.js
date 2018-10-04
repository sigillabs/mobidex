import { BigNumber } from '0x.js';
import * as _ from 'lodash';
import ZeroExClient from '../clients/0x';
import EthereumClient from '../clients/ethereum';
import * as OrderService from '../services/OrderService';
import { TransactionService } from '../services/TransactionService';
import { findOrdersThatCoverMakerAssetFillAmount } from '../utils';

export function deposit(address, amount) {
  return async (dispatch, getState) => {
    const {
      wallet: { web3 }
    } = getState();
    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient);
    const txhash = await zeroExClient.depositEther(new BigNumber(amount));
    const activeTransaction = {
      id: txhash,
      type: 'DEPOSIT',
      address,
      amount
    };
    await TransactionService.instance.addActiveTransaction(activeTransaction);
  };
}

export function withdraw(address, amount) {
  return async (dispatch, getState) => {
    const {
      wallet: { web3 }
    } = getState();
    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient);
    const txhash = await zeroExClient.withdrawEther(new BigNumber(amount));
    const activeTransaction = {
      id: txhash,
      type: 'WITHDRAWAL',
      address,
      amount
    };
    await TransactionService.instance.addActiveTransaction(activeTransaction);
  };
}

export function fillOrKillOrder(order, amount) {
  return async (dispatch, getState) => {
    const {
      wallet: { web3 }
    } = getState();
    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient);
    const txhash = await zeroExClient.fillOrKillOrder(order, amount);
    const activeTransaction = {
      ...order,
      id: txhash,
      type: 'FILL',
      amount
    };
    await TransactionService.instance.addActiveTransaction(activeTransaction);
  };
}

export function batchFillOrKill(orders, amounts) {
  return async (dispatch, getState) => {
    const {
      wallet: { web3 }
    } = getState();

    if (orders.length === 1) {
      await dispatch(fillOrKillOrder(orders[0], amounts[0]));
    } else {
      const ethereumClient = new EthereumClient(web3);
      const zeroExClient = new ZeroExClient(ethereumClient);
      const txhash = await zeroExClient.fillOrKillOrders(orders, amounts);
      const activeTransaction = {
        id: txhash,
        type: 'BATCH_FILL',
        orders,
        amounts
      };
      await TransactionService.instance.addActiveTransaction(activeTransaction);
    }
  };
}

export function marketBuyWithEth(product, amount) {
  return async (dispatch, getState) => {
    const {
      relayer: { orderbooks },
      wallet: { web3 }
    } = getState();

    if (orderbooks[product] === null) {
      return;
    }

    if (orderbooks[product]['asks'] === null) {
      return;
    }

    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient);
    const orders = orderbooks[product]['asks'].map(order =>
      _.pick(order, ZeroExClient.ORDER_FIELDS)
    );
    const feeOrders = orderbooks['ZRX-WETH']['asks'].map(order =>
      _.pick(order, ZeroExClient.ORDER_FIELDS)
    );

    const txhash = await zeroExClient.marketBuyWithEth(
      orders,
      feeOrders,
      ZeroExClient.ZERO.toNumber(),
      ZeroExClient.NULL_ADDRESS,
      amount
    );
    const activeTransaction = {
      id: txhash,
      type: 'MARKET_BUY_WITH_ETH',
      product,
      orders,
      feeOrders,
      amount
    };
    await TransactionService.instance.addActiveTransaction(activeTransaction);
  };
}

export function marketSellEth(product, amount) {
  return async (dispatch, getState) => {
    const {
      relayer: { orderbooks },
      wallet: { web3 }
    } = getState();

    if (orderbooks[product] === null) {
      return;
    }

    if (orderbooks[product]['asks'] === null) {
      return;
    }

    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient);
    const orders = orderbooks[product]['asks'].map(order =>
      _.pick(order, ZeroExClient.ORDER_FIELDS)
    );
    const feeOrders = orderbooks['ZRX-WETH']['asks'].map(order =>
      _.pick(order, ZeroExClient.ORDER_FIELDS)
    );

    const txhash = await zeroExClient.marketSellEth(
      orders,
      feeOrders,
      ZeroExClient.ZERO.toNumber(),
      ZeroExClient.NULL_ADDRESS,
      amount
    );
    const activeTransaction = {
      id: txhash,
      type: 'MARKET_SELL_ETH',
      product,
      orders,
      feeOrders,
      amount
    };
    await TransactionService.instance.addActiveTransaction(activeTransaction);
  };
}

export function marketBuy(product, amount) {
  return async (dispatch, getState) => {
    const {
      relayer: { orderbooks },
      wallet: { web3 }
    } = getState();

    if (orderbooks[product] === null) {
      return;
    }

    if (orderbooks[product]['asks'] === null) {
      return;
    }

    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient);
    const orders = orderbooks[product]['asks'].map(order =>
      _.pick(order, ZeroExClient.ORDER_FIELDS)
    );

    const txhash = await zeroExClient.marketBuy(orders, amount);
    const activeTransaction = {
      id: txhash,
      type: 'MARKET_BUY',
      product,
      orders,
      amount
    };
    await TransactionService.instance.addActiveTransaction(activeTransaction);
  };
}

export function marketSell(product, amount) {
  return async (dispatch, getState) => {
    const {
      relayer: { orderbooks },
      wallet: { web3 }
    } = getState();

    if (orderbooks[product] === null) {
      return;
    }

    if (orderbooks[product]['bids'] === null) {
      return;
    }

    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient);
    const orders = orderbooks[product]['bids'].map(order =>
      _.pick(order, ZeroExClient.ORDER_FIELDS)
    );

    const txhash = await zeroExClient.marketSell(orders, amount);
    const activeTransaction = {
      id: txhash,
      type: 'MARKET_SELL',
      product,
      orders,
      amount
    };
    await TransactionService.instance.addActiveTransaction(activeTransaction);
  };
}

