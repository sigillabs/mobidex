import { assetDataUtils, marketUtils } from '@0xproject/order-utils';
import { BigNumber } from '0x.js';
import * as _ from 'lodash';
import ZeroExClient from '../clients/0x';
import EthereumClient from '../clients/ethereum';
import TokenClient from '../clients/token';
import * as AssetService from '../services/AssetService';
import * as OrderService from '../services/OrderService';
import { TransactionService } from '../services/TransactionService';
import { isValidSignedOrder } from '../utils';
import { checkAndSetUnlimitedProxyAllowance } from './wallet';

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
      wallet: { web3 },
      settings: { gasLimit }
    } = getState();
    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient, { gasLimit });
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
      wallet: { web3 },
      settings: { gasLimit }
    } = getState();

    if (orders.length === 1) {
      await dispatch(fillOrKillOrder(orders[0], amounts[0]));
    } else {
      const ethereumClient = new EthereumClient(web3);
      const zeroExClient = new ZeroExClient(ethereumClient, { gasLimit });
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
      wallet: { web3 },
      settings: { minimumBalance, gasLimit }
    } = getState();

    if (orderbooks[product] === null) {
      return;
    }

    if (orderbooks[product]['asks'] === null) {
      return;
    }

    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient, { gasLimit });
    const balance = new BigNumber(await ethereumClient.getBalance());

    if (balance.lte(minimumBalance)) {
      throw new Error('Need a minimum balance of 0.01 ETH for gas.');
    }

    const maxFillableAmount = new BigNumber(balance.sub(minimumBalance));

    const orders = orderbooks[product]['asks'].map(order =>
      _.pick(order, ZeroExClient.ORDER_FIELDS)
    );
    const feeOrders = orderbooks['ZRX-WETH']['asks'].map(order =>
      _.pick(order, ZeroExClient.ORDER_FIELDS)
    );
    const remainingFillableMakerAssetAmounts = await OrderService.getRemainingFillableMakerAssetAmounts(
      orders
    );
    const {
      ordersRemainingFillableMakerAssetAmounts,
      remainingFillAmount,
      resultOrders
    } = marketUtils.findOrdersThatCoverMakerAssetFillAmount(
      orders,
      new BigNumber(amount),
      {
        remainingFillableMakerAssetAmounts,
        slippageBufferAmount: ZeroExClient.ZERO
      }
    );
    let fillableAmount = resultOrders.reduce(
      (acc, order, index) =>
        acc.add(
          ordersRemainingFillableMakerAssetAmounts[index]
            .div(order.makerAssetAmount)
            .mul(order.takerAssetAmount)
        ),
      ZeroExClient.ZERO
    );
    fillableAmount = new BigNumber(
      fillableAmount.toFixed(0, BigNumber.ROUND_DOWN)
    );

    const txhash = await zeroExClient.marketBuyWithEth(
      orders,
      feeOrders,
      ZeroExClient.ZERO.toNumber(),
      ZeroExClient.NULL_ADDRESS,
      new BigNumber(amount).sub(remainingFillAmount),
      fillableAmount.gt(maxFillableAmount) ? maxFillableAmount : fillableAmount
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
      wallet: { web3 },
      settings: { gasLimit }
    } = getState();

    if (orderbooks[product] === null) {
      return;
    }

    if (orderbooks[product]['asks'] === null) {
      return;
    }

    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient, { gasLimit });
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
      wallet: { web3 },
      settings: { gasLimit }
    } = getState();

    if (orderbooks[product] === null) {
      return;
    }

    if (orderbooks[product]['asks'] === null) {
      return;
    }

    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient, { gasLimit });
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
      wallet: { web3 },
      settings: { gasLimit }
    } = getState();

    if (orderbooks[product] === null) {
      return;
    }

    if (orderbooks[product]['bids'] === null) {
      return;
    }

    if (orderbooks[product]['bids'].length === 0) {
      return;
    }

    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient, { gasLimit });
    const orders = orderbooks[product]['bids'];
    // console.warn(
    //   JSON.stringify(
    //     _.zip(
    //       orderbooks[product]['bids'].map(order => order.orderHash),
    //       await OrderService.getRemainingFillableTakerAssetAmounts(
    //         orderbooks[product]['bids']
    //       )
    //     )
    //   )
    // );

    // const makerTokenAddress = assetDataUtils.decodeERC20AssetData(
    //   orderbooks[product]['bids'][0].makerAssetData
    // ).tokenAddress;
    // const takerTokenAddress = assetDataUtils.decodeERC20AssetData(
    //   orderbooks[product]['bids'][0].takerAssetData
    // ).tokenAddress;

    // const makerTokenClient = new TokenClient(ethereumClient, makerTokenAddress);
    // console.warn(
    //   (await Promise.all(
    //     orderbooks[product]['bids'].map(order =>
    //       makerTokenClient.getAllowance(order.makerAddress)
    //     )
    //   )).map(allowance => allowance.toString())
    // );

    // const takerTokenClient = new TokenClient(ethereumClient, takerTokenAddress);
    // console.warn(
    //   (await Promise.all(
    //     orderbooks[product]['bids'].map(order =>
    //       takerTokenClient.getAllowance(order.takerAddress)
    //     )
    //   )).map(allowance => allowance.toString())
    // );

    // console.warn(
    //   orderbooks[product]['bids'].map(order => isValidSignedOrder(order))
    // );

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

export function batchMarketBuyWithEth(product, amount) {
  return async dispatch => {
    const asset = AssetService.getWETHAsset();
    await dispatch(checkAndSetUnlimitedProxyAllowance(asset.address));
    await dispatch(marketBuyWithEth(product, amount));
  };
}

export function batchMarketSell(product, amount) {
  return async dispatch => {
    const asset = AssetService.findAssetBySymbol(product.split('-')[0]);
    await dispatch(checkAndSetUnlimitedProxyAllowance(asset.address));
    await dispatch(marketSell(product, amount));
  };
}
