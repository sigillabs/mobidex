import { AssetBuyer } from '@0xproject/asset-buyer';
import { BigNumber } from '0x.js';
import ZeroExClient from '../clients/0x';
import EthereumClient from '../clients/ethereum';
import * as AssetService from '../services/AssetService';
import { TransactionService } from '../services/TransactionService';
import * as WalletService from '../services/WalletService';
import { checkAndSetUnlimitedProxyAllowance } from './wallet';

export function deposit(address, amount) {
  return async (dispatch, getState) => {
    const {
      settings: { gasPrice, gasLimit }
    } = getState();

    const web3 = WalletService.getWeb3();

    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient, {
      gasPrice,
      gasLimit
    });
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
      settings: { gasPrice, gasLimit }
    } = getState();

    const web3 = WalletService.getWeb3();

    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient, {
      gasPrice,
      gasLimit
    });
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
      settings: { gasPrice, gasLimit }
    } = getState();

    const web3 = WalletService.getWeb3();

    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient, {
      gasPrice,
      gasLimit
    });
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
      settings: { gasPrice, gasLimit }
    } = getState();

    const web3 = WalletService.getWeb3();

    if (orders.length === 1) {
      await dispatch(fillOrKillOrder(orders[0], amounts[0]));
    } else {
      const ethereumClient = new EthereumClient(web3);
      const zeroExClient = new ZeroExClient(ethereumClient, {
        gasPrice,
        gasLimit
      });
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

export function marketBuyWithEth(quote) {
  return async (dispatch, getState) => {
    const {
      settings: { gasPrice, gasLimit }
    } = getState();

    const web3 = WalletService.getWeb3();

    if (quote === null) {
      throw new Error('Need a quote to sell assets.');
    }

    if (!quote.orders.length) {
      throw new Error('Need orders to fill in order to sell assets.');
    }

    const ethereumClient = new EthereumClient(web3);
    const buyer = AssetBuyer.getAssetBuyerForProvidedOrders(
      ethereumClient.getCurrentProvider(),
      quote.orders,
      quote.feeOrders,
      {
        expiryBufferSeconds: 30,
        networkId: await ethereumClient.getNetworkId()
      }
    );

    const txhash = await buyer.executeBuyQuoteAsync(quote, {
      gasPrice,
      gasLimit
    });
    const activeTransaction = {
      id: txhash,
      type: 'MARKET_BUY',
      quote
    };
    await TransactionService.instance.addActiveTransaction(activeTransaction);
  };
}

export function marketBuy(quote) {
  return async (dispatch, getState) => {
    const {
      settings: { gasPrice, gasLimit }
    } = getState();

    const web3 = WalletService.getWeb3();

    if (quote === null) {
      throw new Error('Need a quote to buy assets.');
    }

    if (!quote.orders.length) {
      throw new Error('Need orders to fill in order to buy assets.');
    }

    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient, {
      gasPrice,
      gasLimit
    });

    const txhash = await zeroExClient.marketBuy(
      quote.orders,
      quote.assetBuyAmount
    );
    const activeTransaction = {
      id: txhash,
      type: 'MARKET_BUY',
      quote
    };
    await TransactionService.instance.addActiveTransaction(activeTransaction);
  };
}

export function marketSell(quote) {
  return async (dispatch, getState) => {
    const {
      settings: { gasPrice, gasLimit }
    } = getState();

    const web3 = WalletService.getWeb3();

    if (quote === null) {
      throw new Error('Need a quote to sell assets.');
    }

    if (!quote.orders.length) {
      throw new Error('Need orders to fill in order to sell assets.');
    }

    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient, {
      gasPrice,
      gasLimit
    });

    const txhash = await zeroExClient.marketSell(
      quote.orders,
      quote.assetSellAmount
    );
    const activeTransaction = {
      id: txhash,
      type: 'MARKET_SELL',
      quote
    };
    await TransactionService.instance.addActiveTransaction(activeTransaction);
  };
}

export function batchMarketBuyWithEth(quote) {
  return async dispatch => {
    const asset = AssetService.getWETHAsset();
    await dispatch(checkAndSetUnlimitedProxyAllowance(asset.address));
    await dispatch(marketBuyWithEth(quote));
  };
}

export function batchMarketBuy(quote) {
  return async dispatch => {
    const asset = AssetService.getWETHAsset();
    await dispatch(checkAndSetUnlimitedProxyAllowance(asset.address));
    await dispatch(marketBuy(quote));
  };
}

export function batchMarketSell(quote) {
  return async dispatch => {
    const asset = AssetService.findAssetByData(quote.assetData);
    await dispatch(checkAndSetUnlimitedProxyAllowance(asset.address));
    await dispatch(marketSell(quote));
  };
}
