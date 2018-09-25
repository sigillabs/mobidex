import { BigNumber } from '0x.js';
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
        amounts
      };
      await TransactionService.instance.addActiveTransaction(activeTransaction);
    }
  };
}

export function marketBuyWithEth(product, amountInWEI) {
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

    zeroExClient.marketBuyWithEth(
      orderbooks[product]['asks'],
      orderbooks['ZRX-WETH']['asks'],
      ZeroExClient.ZERO,
      ZeroExClient.NULL_ADDRESS,
      amountInWEI
    );
  };
}

export function marketSellEth(product, amountInWEI) {
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

    zeroExClient.marketSellEth(
      orderbooks[product]['asks'],
      orderbooks['ZRX-WETH']['asks'],
      ZeroExClient.ZERO,
      ZeroExClient.NULL_ADDRESS,
      amountInWEI
    );
  };
}

export function marketSell(product, amount) {
  return async (dispatch, getState) => {
    const {
      relayer: { orderbooks }
    } = getState();

    if (orderbooks[product] === null) {
      return;
    }

    if (orderbooks[product]['bids'] === null) {
      return;
    }

    const remainingFillableTakerAssetAmounts = await OrderService.getRemainingFillableTakerAssetAmounts(
      orderbooks[product]['bids']
    );

    const orders = findOrdersThatCoverMakerAssetFillAmount(
      orderbooks[product]['bids'],
      amount,
      { remainingFillableTakerAssetAmounts }
    );

    if (orders.length > 0) {
      await dispatch(
        batchFillOrKill(
          orders,
          remainingFillableTakerAssetAmounts.slice(0, orders.length)
        )
      );
    }
  };
}
