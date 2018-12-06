import { orderParsingUtils } from '@0xproject/order-utils';
import { assetDataUtils } from '0x.js';
import ethUtil from 'ethereumjs-util';
import * as _ from 'lodash';
import {
  addAssets,
  setOrders,
  setOrderbook,
  setProducts,
  setQuote
} from '../actions';
import EthereumClient from '../clients/ethereum';
import RelayerClient from '../clients/relayer';
import TokenClient from '../clients/token';
import ZeroExClient from '../clients/0x';
import * as AssetService from '../services/AssetService';
import { showErrorModal } from '../navigation';
import * as OrderService from '../services/OrderService';
import { TransactionService } from '../services/TransactionService';
import * as WalletService from '../services/WalletService';

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

    try {
      const client = new RelayerClient(relayerEndpoint, { network });
      const orderbook = await client.getOrderbook(
        baseAsset.assetData,
        quoteAsset.assetData,
        force
      );

      orderbook.asks = fixOrders(orderbook.asks);
      orderbook.bids = fixOrders(orderbook.bids);
      dispatch(
        setOrderbook([
          baseAsset.assetData,
          quoteAsset.assetData,
          orderbook.bids,
          orderbook.asks
        ])
      );
    } catch (err) {
      showErrorModal(err);
    }
  };
}

export function loadOrderbooks(force = false) {
  return async (dispatch, getState) => {
    let {
      relayer: { products }
    } = getState();

    return Promise.all(
      products.map(product =>
        dispatch(
          loadOrderbook(
            product.assetDataB.assetData,
            product.assetDataA.assetData,
            force
          )
        )
      )
    );
  };
}

export function loadOrders(force = false) {
  return async (dispatch, getState) => {
    const {
      wallet: { address },
      settings: { network, relayerEndpoint }
    } = getState();

    try {
      const client = new RelayerClient(relayerEndpoint, { network });
      const orders = await client.getOrdersForAddress(address, force);
      dispatch(setOrders(fixOrders(orders)));
    } catch (err) {
      showErrorModal(err);
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
      showErrorModal(err);
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
      showErrorModal(err);
    }
  };
}

export function loadAssets(force = false) {
  return async (dispatch, getState) => {
    const {
      relayer: { products }
    } = getState();

    const web3 = WalletService.getWeb3();

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
      showErrorModal(err);
    }
  };
}

export function loadMarketBuyQuote(
  assetData,
  assetBuyAmount,
  options = {
    slippagePercentage: 0.2,
    expiryBufferSeconds: 30,
    filterInvalidOrders: true
  }
) {
  return async dispatch => {
    dispatch(setQuote(['buy', null, true]));
    try {
      const quote = await OrderService.getBuyAssetsQuoteAsync(
        assetData,
        assetBuyAmount,
        options
      );
      dispatch(setQuote(['buy', quote, false]));
    } catch (err) {
      dispatch(setQuote(['buy', null, false, err]));
    }
  };
}

export function loadMarketSellQuote(
  assetData,
  assetSellAmount,
  options = {
    slippagePercentage: 0.2,
    expiryBufferSeconds: 30
  }
) {
  return async dispatch => {
    dispatch(setQuote(['sell', null, true]));
    try {
      const quote = await OrderService.getSellAssetsQuoteAsync(
        assetData,
        assetSellAmount,
        options
      );
      dispatch(setQuote(['sell', quote, false]));
    } catch (err) {
      dispatch(setQuote(['sell', null, false, err]));
    }
  };
}

export function submitOrder(order) {
  return async (dispatch, getState) => {
    const {
      settings: { network, relayerEndpoint }
    } = getState();

    // Sign
    const signedOrder = await OrderService.signOrder(order);

    // Submit
    const client = new RelayerClient(relayerEndpoint, { network });
    await client.submitOrder(signedOrder);

    dispatch(loadOrder(signedOrder.orderHash));
  };
}

export function cancelOrder(order) {
  return async (dispatch, getState) => {
    const {
      wallet: { address }
    } = getState();

    const web3 = WalletService.getWeb3();

    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = await new ZeroExClient(ethereumClient);

    if (
      ethUtil.stripHexPrefix(order.makerAddress) !==
      ethUtil.stripHexPrefix(address)
    ) {
      throw new Error('Cannot cancel order that is not yours');
    }

    const txhash = await zeroExClient.cancelOrder(
      _.pick(order, ZeroExClient.ORDER_FIELDS)
    );
    const activeTransaction = {
      ...order,
      id: txhash,
      type: 'CANCEL'
    };
    TransactionService.instance.addActiveTransaction(activeTransaction);
  };
}
