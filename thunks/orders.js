import { orderParsingUtils, orderHashUtils } from '@0xproject/order-utils';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { assetDataUtils, BigNumber } from '0x.js';
import ethUtil from 'ethereumjs-util';
import * as _ from 'lodash';
import { addAssets, setOrders, setOrderbook, setProducts } from '../actions';
import EthereumClient from '../clients/ethereum';
import RelayerClient from '../clients/relayer';
import TokenClient from '../clients/token';
import ZeroExClient from '../clients/0x';
import * as AssetService from '../services/AssetService';
import NavigationService from '../services/NavigationService';
import * as OrderService from '../services/OrderService';
import { TransactionService } from '../services/TransactionService';
import { formatProduct } from '../utils';
import { fillOrKillOrder, batchFillOrKill } from './0x';
import {
  checkAndWrapEther,
  checkAndUnwrapEther,
  checkAndSetTokenAllowance
} from './wallet';

function fixOrders(orders) {
  if (!orders) return null;
  return orders
    .filter(order => Boolean(order))
    .map(orderParsingUtils.convertOrderStringFieldsToBigNumber);
}

export function loadOrderbook(baseAssetData, quoteAssetData, force = false) {
  return async (dispatch, getState) => {
    let {
      settings: { network, relayerEndpoint }
    } = getState();

    const baseAsset = AssetService.findAssetByData(baseAssetData);
    const quoteAsset = AssetService.findAssetByData(quoteAssetData);

    if (!baseAsset) {
      throw new Error('Could not find base asset');
    }

    if (!quoteAsset) {
      throw new Error('Could not find quote asset');
    }

    const product = formatProduct(baseAsset.symbol, quoteAsset.symbol);

    try {
      const client = new RelayerClient(relayerEndpoint, { network });
      const orderbook = await client.getOrderbook(
        baseAsset.assetData,
        quoteAsset.assetData,
        force
      );
      orderbook.asks = fixOrders(orderbook.asks);
      orderbook.bids = fixOrders(orderbook.bids);
      dispatch(setOrderbook([product, orderbook]));
    } catch (err) {
      NavigationService.error(err);
    }
  };
}

export function loadOrderbooks(force = false) {
  return async (dispatch, getState) => {
    let {
      relayer: { products }
    } = getState();

    for (const product of products) {
      await dispatch(
        loadOrderbook(
          product.assetDataB.assetData,
          product.assetDataA.assetData,
          force
        )
      );
    }
  };
}

export function loadOrders(force = false) {
  return async (dispatch, getState) => {
    let {
      settings: { network, relayerEndpoint }
    } = getState();

    try {
      const client = new RelayerClient(relayerEndpoint, { network });
      const orders = await client.getOrders(force);
      dispatch(setOrders(fixOrders(orders)));
      return true;
    } catch (err) {
      NavigationService.error(err);
      return false;
    }
  };
}

export function loadOrder(orderHash) {
  return async (dispatch, getState) => {
    let {
      settings: { network, relayerEndpoint }
    } = getState();

    try {
      const client = new RelayerClient(relayerEndpoint, { network });
      const order = await client.getOrder(orderHash);
      if (!order) return;
      dispatch(
        setOrders([
          orderParsingUtils.convertOrderStringFieldsToBigNumber(order)
        ])
      );
    } catch (err) {
      NavigationService.error(err);
    }
  };
}

export function loadProducts(force = false) {
  return async (dispatch, getState) => {
    const {
      settings: { network, relayerEndpoint }
    } = getState();

    try {
      const client = new RelayerClient(relayerEndpoint, { network });
      const pairs = await client.getAssetPairs(force);
      const extendedPairs = pairs.map(({ assetDataA, assetDataB }) => ({
        assetDataA: {
          ...assetDataA,
          address: assetDataUtils.decodeERC20AssetData(assetDataA.assetData)
            .tokenAddress
        },
        assetDataB: {
          ...assetDataB,
          address: assetDataUtils.decodeERC20AssetData(assetDataB.assetData)
            .tokenAddress
        }
      }));
      dispatch(setProducts(extendedPairs));
    } catch (err) {
      NavigationService.error(err);
    }
  };
}

export function loadAssets(force = false) {
  return async (dispatch, getState) => {
    const {
      relayer: { products },
      wallet: { web3 }
    } = getState();

    try {
      const ethereumClient = new EthereumClient(web3);
      const productsA = products.map(pair => pair.assetDataA);
      const productsB = products.map(pair => pair.assetDataB);
      const allAssets = _.unionBy(productsA, productsB, 'assetData');
      const allExtendedAssets = await Promise.all(
        allAssets.map(async asset => {
          const tokenClient = new TokenClient(ethereumClient, asset.address);
          const extendedToken = await tokenClient.get(force);
          return {
            ...asset,
            ...extendedToken
          };
        })
      );
      dispatch(
        addAssets(
          [
            {
              assetData: null,
              address: null,
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH'
            }
          ].concat(allExtendedAssets)
        )
      );
    } catch (err) {
      NavigationService.error(err);
    }
  };
}

export function submitOrder(signedOrder) {
  return async (dispatch, getState) => {
    const {
      settings: { network, relayerEndpoint }
    } = getState();
    const client = new RelayerClient(relayerEndpoint, { network });
    const makerTokenAddress = assetDataUtils.decodeERC20AssetData(
      signedOrder.makerAssetData
    ).tokenAddress;
    const takerTokenAddress = assetDataUtils.decodeERC20AssetData(
      signedOrder.takerAssetData
    ).tokenAddress;

    await dispatch(
      checkAndWrapEther(makerTokenAddress, signedOrder.makerAssetAmount, {
        wei: true,
        batch: false
      })
    );
    await dispatch(
      checkAndSetTokenAllowance(
        takerTokenAddress,
        signedOrder.takerAssetAmount,
        { wei: true, batch: false }
      )
    );

    // Submit
    await client.submitOrder(signedOrder);

    dispatch(loadOrder(signedOrder.orderHash));
  };
}

export function fillOrder(order, amount = null) {
  return async (dispatch, getState) => {
    const {
      wallet: { web3 }
    } = getState();
    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = await new ZeroExClient(ethereumClient);
    const quoteToken = AssetService.getQuoteAsset();
    let orderAmount;
    let fillBaseUnitAmount;
    let baseToken;

    if (order.makerAssetData === quoteToken.assetData) {
      orderAmount = order.takerAssetAmount;
      baseToken = await AssetService.findAssetByData(order.takerAssetData);
    } else if (order.takerAssetData === quoteToken.assetData) {
      orderAmount = order.makerAssetAmount;
      baseToken = await AssetService.findAssetByData(order.makerAssetData);
    } else {
      throw new Error('Quote token not involved in order.');
    }

    const orderHash = orderHashUtils.getOrderHashHex(order);
    const filledAmount = await zeroExClient.getFilledTakerAmount(
      orderHash,
      false
    );

    if (amount) {
      fillBaseUnitAmount = Web3Wrapper.toBaseUnitAmount(
        new BigNumber(amount),
        baseToken.decimals
      )
        .div(orderAmount)
        .mul(order.takerAssetAmount);
      // .sub(filledAmount);

      // Rounding does not work
      // Big hack
      if (fillBaseUnitAmount.dp() > 0) {
        fillBaseUnitAmount = new BigNumber(
          fillBaseUnitAmount.toString().slice(0, -1 - fillBaseUnitAmount.dp())
        );
      }
    } else {
      fillBaseUnitAmount = order.takerAssetAmount;
    }

    const maxFillAmount = new BigNumber(order.takerAssetAmount).sub(
      filledAmount
    );

    if (fillBaseUnitAmount.gt(maxFillAmount)) {
      fillBaseUnitAmount = maxFillAmount;
    }

    const takerTokenAddress = assetDataUtils.decodeERC20AssetData(
      order.takerAssetData
    ).tokenAddress;

    await dispatch(
      checkAndWrapEther(takerTokenAddress, fillBaseUnitAmount, {
        wei: true,
        batch: false
      })
    );
    await dispatch(
      checkAndSetTokenAllowance(takerTokenAddress, fillBaseUnitAmount, {
        wei: true,
        batch: false
      })
    );
    await dispatch(fillOrKillOrder(order, fillBaseUnitAmount));
  };
}

export function fillOrders(orders, amount = null) {
  return async dispatch => {
    if (!orders || orders.length === 0) {
      return;
    }

    if (orders.length === 1) {
      return dispatch(fillOrder(orders[0], amount));
    }

    const makerAssetData = _.chain(orders)
      .map('makerAssetData')
      .uniq()
      .value();
    if (makerAssetData.length > 1) {
      throw new Error('Orders contain different maker token addresses');
    }
    if (makerAssetData.length < 1) {
      throw new Error('Need at least 1 order');
    }

    const takerAssetData = _.chain(orders)
      .map('takerAssetData')
      .uniq()
      .value();
    if (takerAssetData.length > 1) {
      throw new Error('Orders contain different taker token addresses');
    }
    if (takerAssetData.length < 1) {
      throw new Error('Need at least 1 order');
    }

    const quoteToken = AssetService.getQuoteAsset();
    let baseToken;

    if (makerAssetData[0] === quoteToken.assetData) {
      baseToken = await AssetService.findAssetByData(takerAssetData[0]);
    } else if (takerAssetData[0] === quoteToken.assetData) {
      baseToken = await AssetService.findAssetByData(makerAssetData[0]);
    } else {
      throw new Error('Quote token not involved in order.');
    }

    const baseUnitAmount =
      amount !== null
        ? Web3Wrapper.toBaseUnitAmount(
            new BigNumber(amount),
            baseToken.decimals
          )
        : null;

    const amounts = await OrderService.getFillableOrderAmounts(
      orders,
      baseUnitAmount !== null ? new BigNumber(baseUnitAmount) : null
    );

    const fillableBaseUnitAmount = amounts.reduce(
      (acc, amount) => acc.add(amount),
      ZeroExClient.ZERO
    );

    const takerTokenAddress = assetDataUtils.decodeERC20AssetData(
      takerAssetData[0]
    ).tokenAddress;

    await dispatch(
      checkAndWrapEther(takerTokenAddress, fillableBaseUnitAmount, {
        wei: true,
        batch: false
      })
    );
    await dispatch(
      checkAndSetTokenAllowance(takerTokenAddress, fillableBaseUnitAmount, {
        wei: true,
        batch: false
      })
    );
    await dispatch(batchFillOrKill(orders, amounts));
  };
}

export function cancelOrder(order) {
  return async (dispatch, getState) => {
    const {
      wallet: { web3, address }
    } = getState();
    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = await new ZeroExClient(ethereumClient);

    if (
      ethUtil.stripHexPrefix(order.makerAddress) !==
      ethUtil.stripHexPrefix(address)
    ) {
      throw new Error('Cannot cancel order that is not yours');
    }

    const makerTokenAddress = assetDataUtils.decodeERC20AssetData(
      order.makerAssetData
    ).tokenAddress;

    try {
      await dispatch(
        checkAndUnwrapEther(makerTokenAddress, order.makerAssetAmount, {
          wei: true,
          batch: false
        })
      );
    } catch (err) {
      console.warn(err);
      if (err.message !== 'INSUFFICIENT_WETH_BALANCE_FOR_WITHDRAWAL') {
        throw err;
      }
    }
    const txhash = await zeroExClient.cancelOrder(order);
    console.warn('here3');
    const activeTransaction = {
      ...order,
      id: txhash,
      type: 'CANCEL'
    };
    TransactionService.instance.addActiveTransaction(activeTransaction);
  };
}
