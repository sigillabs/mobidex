import { HttpClient } from '@0xproject/connect';
import { ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import ethUtil from 'ethereumjs-util';
import * as _ from 'lodash';
import {
  addOrders,
  setOrders,
  setOrderbook,
  setProducts,
  setTokens
} from '../actions';
import EthereumClient from '../clients/ethereum';
import RelayerClient from '../clients/relayer';
import TokenClient from '../clients/token';
import ZeroExClient from '../clients/0x';
import NavigationService from '../services/NavigationService';
import * as OrderService from '../services/OrderService';
import * as TokenService from '../services/TokenService';
import { TransactionService } from '../services/TransactionService';
import * as ZeroExService from '../services/ZeroExService';
import { formatProduct } from '../utils';
import {
  checkAndWrapEther,
  checkAndUnwrapEther,
  checkAndSetTokenAllowance
} from './wallet';

function fixOrder(order) {
  return {
    ...order,
    makerTokenAmount: new BigNumber(order.makerTokenAmount),
    takerTokenAmount: new BigNumber(order.takerTokenAmount),
    makerFee: new BigNumber(order.makerFee),
    takerFee: new BigNumber(order.takerFee),
    expirationUnixTimestampSec: new BigNumber(order.expirationUnixTimestampSec),
    salt: new BigNumber(order.salt)
  };
}

function fixOrders(orders) {
  if (!orders) return null;
  return orders.map(fixOrder);
}

export function loadOrderbook(
  baseTokenAddress,
  quoteTokenAddress,
  force = false
) {
  return async (dispatch, getState) => {
    let {
      settings: { network, relayerEndpoint }
    } = getState();

    const baseToken = TokenService.findTokenByAddress(baseTokenAddress);
    const quoteToken = TokenService.findTokenByAddress(quoteTokenAddress);

    if (!baseToken) {
      throw new Error('Could not find base token');
    }

    if (!quoteToken) {
      throw new Error('Could not find quote token');
    }

    const product = formatProduct(baseToken.symbol, quoteToken.symbol);

    try {
      const client = new RelayerClient(relayerEndpoint, { network });
      const orderbook = await client.getOrderbook(
        baseTokenAddress,
        quoteTokenAddress,
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
        loadOrderbook(product.tokenB.address, product.tokenA.address, force)
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
      dispatch(setOrders([fixOrder(order)]));
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
      const pairs = await client.getTokenPairs(force);
      dispatch(setProducts(pairs));
    } catch (err) {
      console.warn(err);
      NavigationService.error(err);
    }
  };
}

export function loadTokens(force = false) {
  return async (dispatch, getState) => {
    const {
      relayer: { products },
      wallet: { web3 }
    } = getState();

    try {
      const ethereumClient = new EthereumClient(web3);
      const productsA = products.map(pair => pair.tokenA);
      const productsB = products.map(pair => pair.tokenB);
      const allTokens = _.unionBy(productsA, productsB, 'address');
      const allExtendedTokens = await Promise.all(
        allTokens.map(async token => {
          const tokenClient = new TokenClient(ethereumClient, token.address);
          const extendedToken = await tokenClient.get(force);
          return {
            ...token,
            ...extendedToken
          };
        })
      );
      dispatch(setTokens(allExtendedTokens));
    } catch (err) {
      NavigationService.error(err);
    }
  };
}

export function loadProductsAndTokens() {
  return async dispatch => {
    await dispatch(loadProducts());
    await dispatch(loadTokens());
  };
}

export function submitOrder(signedOrder) {
  return async (dispatch, getState) => {
    const {
      settings: { relayerEndpoint }
    } = getState();
    const relayerClient = new HttpClient(relayerEndpoint);

    await dispatch(
      checkAndWrapEther(
        signedOrder.makerTokenAddress,
        signedOrder.makerTokenAmount,
        { wei: true, batch: false }
      )
    );
    await dispatch(
      checkAndSetTokenAllowance(
        signedOrder.makerTokenAddress,
        signedOrder.makerTokenAmount,
        { wei: true, batch: false }
      )
    );

    // Submit
    await relayerClient.submitOrderAsync(signedOrder);

    dispatch(loadOrder(signedOrder.orderHash));
  };
}

export function fillOrder(order, amount = null) {
  return async dispatch => {
    const quoteToken = TokenService.getQuoteToken();
    let orderAmount;
    let fillBaseUnitAmount;
    let baseToken;

    if (order.makerTokenAddress === quoteToken.address) {
      orderAmount = order.takerTokenAmount;
      baseToken = await TokenService.findTokenByAddress(
        order.takerTokenAddress
      );
    } else if (order.takerTokenAddress === quoteToken.address) {
      orderAmount = order.makerTokenAmount;
      baseToken = await TokenService.findTokenByAddress(
        order.makerTokenAddress
      );
    } else {
      throw new Error('Quote token not involved in order.');
    }

    if (amount) {
      fillBaseUnitAmount = ZeroEx.toBaseUnitAmount(
        new BigNumber(amount),
        baseToken.decimals
      )
        .div(orderAmount)
        .mul(order.takerTokenAmount);
      // .sub(order.filledTakerTokenAmount);

      // Rounding does not work
      // Big hack
      if (fillBaseUnitAmount.dp() > 0) {
        fillBaseUnitAmount = new BigNumber(
          fillBaseUnitAmount.toString().slice(0, -1 - fillBaseUnitAmount.dp())
        );
      }
    } else {
      fillBaseUnitAmount = order.takerTokenAmount;
    }

    const maxFillAmount = new BigNumber(order.takerTokenAmount).sub(
      order.filledTakerTokenAmount
    );

    if (fillBaseUnitAmount.gt(maxFillAmount)) {
      fillBaseUnitAmount = maxFillAmount;
    }

    await dispatch(
      checkAndWrapEther(order.takerTokenAddress, fillBaseUnitAmount, {
        wei: true,
        batch: false
      })
    );
    await dispatch(
      checkAndSetTokenAllowance(order.takerTokenAddress, fillBaseUnitAmount, {
        wei: true,
        batch: false
      })
    );
    await ZeroExService.fillOrder(order, fillBaseUnitAmount, amount, {
      wei: true,
      batch: false
    });
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

    const makerTokenAddresses = _.chain(orders)
      .map('makerTokenAddress')
      .uniq()
      .value();
    if (makerTokenAddresses.length > 1) {
      throw new Error('Orders contain different maker token addresses');
    }
    if (makerTokenAddresses.length < 1) {
      throw new Error('Need at least 1 order');
    }

    const takerTokenAddresses = _.chain(orders)
      .map('takerTokenAddress')
      .uniq()
      .value();
    if (takerTokenAddresses.length > 1) {
      throw new Error('Orders contain different taker token addresses');
    }
    if (takerTokenAddresses.length < 1) {
      throw new Error('Need at least 1 order');
    }

    const orderRequests = OrderService.convertZeroExOrdersToOrderRequests(
      orders,
      amount ? new BigNumber(amount) : null
    );

    const baseUnitAmount = _.reduce(
      orderRequests,
      (a, o) => a.add(o.takerTokenFillAmount),
      new BigNumber(0)
    );

    await dispatch(
      checkAndWrapEther(takerTokenAddresses[0], baseUnitAmount, {
        wei: true,
        batch: false
      })
    );
    await dispatch(
      checkAndSetTokenAllowance(takerTokenAddresses[0], baseUnitAmount, {
        wei: true,
        batch: false
      })
    );
    await ZeroExService.batchFillOrKill(orderRequests, amount, {
      wei: true,
      batch: false
    });
  };
}

export function cancelOrder(order) {
  return async (dispatch, getState) => {
    const {
      wallet: { web3, address }
    } = getState();
    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient);
    const zeroEx = await zeroExClient.getZeroExClient();

    if (
      ethUtil.stripHexPrefix(order.maker) !== ethUtil.stripHexPrefix(address)
    ) {
      throw new Error('Cannot cancel order that is not yours');
    }

    try {
      await dispatch(
        checkAndUnwrapEther(order.makerTokenAddress, order.makerTokenAmount, {
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

    const txhash = await zeroEx.exchange.cancelOrderAsync(
      order,
      new BigNumber(order.makerTokenAmount)
    );

    const activeTransaction = {
      ...order,
      id: txhash,
      type: 'CANCEL'
    };
    TransactionService.instance.addActiveTransaction(activeTransaction);
  };
}
