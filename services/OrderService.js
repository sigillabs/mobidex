import { orderStateUtils } from '@0xproject/order-utils';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import {
  assetDataUtils,
  BigNumber,
  generatePseudoRandomSalt,
  orderHashUtils
} from '0x.js';
import * as _ from 'lodash';
import moment from 'moment';
import EthereumClient from '../clients/ethereum';
import ZeroExClient from '../clients/0x';
import { formatProduct } from '../utils';
import * as AssetService from './AssetService';
import NavigationService from './NavigationService';

let _store;

export function setStore(store) {
  _store = store;
}

export function getOrderbook(baseToken, quoteToken = null) {
  const {
    relayer: { orderbooks }
  } = _store.getState();

  if (!quoteToken) {
    quoteToken = AssetService.getQuoteAsset();
  } else if (typeof quoteToken === 'string') {
    quoteToken = AssetService.findAssetByAddress(quoteToken);
  }

  if (typeof baseToken === 'string') {
    baseToken = AssetService.findAssetByAddress(baseToken);
  }

  if (!baseToken || !quoteToken) {
    return null;
  }

  const product = formatProduct(baseToken.symbol, quoteToken.symbol);

  return orderbooks[product];
}

export function getOrderPrice(order) {
  if (!order) return 0;

  const makerToken = AssetService.findAssetByData(order.makerAssetData);
  const takerToken = AssetService.findAssetByData(order.takerAssetData);
  const quoteToken = AssetService.getQuoteAsset();

  if (!makerToken) return 0;
  if (!takerToken) return 0;
  if (!quoteToken) return 0;

  const makerTokenUnitAmount = Web3Wrapper.toUnitAmount(
    new BigNumber(order.makerAssetAmount),
    makerToken.decimals
  );
  const takerTokenUnitAmount = Web3Wrapper.toUnitAmount(
    new BigNumber(order.takerAssetAmount),
    takerToken.decimals
  );

  if (quoteToken.address === makerToken.address) {
    return makerTokenUnitAmount.div(takerTokenUnitAmount);
  } else if (quoteToken.address === takerToken.address) {
    return takerTokenUnitAmount.div(makerTokenUnitAmount);
  } else {
    return 0;
  }
}

export function getAveragePrice(orders) {
  if (orders.length === 0) {
    return 0;
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

  return orders
    .map(o => getOrderPrice(o))
    .reduce((acc, price) => acc.add(price))
    .div(orders.length);
}

export function convertLimitOrderToZeroExOrder(limitOrder) {
  const {
    relayer: { assets }
  } = _store.getState();

  const quoteToken = _.find(assets, { address: limitOrder.quoteAddress });
  const baseToken = _.find(assets, { address: limitOrder.baseAddress });

  if (!quoteToken) return null;
  if (!baseToken) return null;

  let order = {
    makerAssetData: null,
    makerAssetAmount: null,
    takerAssetData: null,
    takerAssetAmount: null
  };

  switch (limitOrder.side) {
    case 'buy':
      order.makerAssetData = assetDataUtils.encodeERC20AssetData(
        quoteToken.address
      );
      order.makerAssetAmount = Web3Wrapper.toBaseUnitAmount(
        new BigNumber(limitOrder.price).mul(limitOrder.amount).abs(),
        quoteToken.decimals
      );
      order.takerAssetData = assetDataUtils.encodeERC20AssetData(
        baseToken.address
      );
      order.takerAssetAmount = Web3Wrapper.toBaseUnitAmount(
        new BigNumber(limitOrder.amount).abs(),
        baseToken.decimals
      );
      break;

    case 'sell':
      order.makerAssetData = assetDataUtils.encodeERC20AssetData(
        baseToken.address
      );
      order.makerAssetAmount = Web3Wrapper.toBaseUnitAmount(
        new BigNumber(limitOrder.amount).abs(),
        baseToken.decimals
      );
      order.takerAssetData = assetDataUtils.encodeERC20AssetData(
        quoteToken.address
      );
      order.takerAssetAmount = Web3Wrapper.toBaseUnitAmount(
        new BigNumber(limitOrder.price).mul(limitOrder.amount).abs(),
        quoteToken.decimals
      );
      break;
  }

  return order;
}

export function convertZeroExOrderToLimitOrder(order) {
  const {
    relayer: { assets }
  } = _store.getState();

  const makerToken = _.find(assets, { assetData: order.makerAssetData });
  const takerToken = _.find(assets, { assetData: order.takerAssetData });
  const quoteToken = AssetService.getQuoteAsset();

  if (!makerToken) return null;
  if (!takerToken) return null;

  const makerTokenUnitAmount = Web3Wrapper.toUnitAmount(
    new BigNumber(order.makerAssetAmount),
    makerToken.decimals
  );
  const takerTokenUnitAmount = Web3Wrapper.toUnitAmount(
    new BigNumber(order.takerAssetAmount),
    takerToken.decimals
  );

  const limitOrder = {
    baseAddress: null,
    quoteAddress: null,
    price: null,
    amount: null,
    side: null
  };

  if (quoteToken.address === makerToken.address) {
    limitOrder.baseAddress = assetDataUtils.decodeERC20AssetData(
      order.takerAssetData
    ).tokenAddress;
    limitOrder.quoteAddress = assetDataUtils.decodeERC20AssetData(
      order.makerAssetData
    ).tokenAddress;
    limitOrder.price = makerTokenUnitAmount.div(takerTokenUnitAmount);
    limitOrder.amount = takerTokenUnitAmount;
    limitOrder.side = 'buy';
    return limitOrder;
  } else if (quoteToken.address === takerToken.address) {
    limitOrder.baseAddress = assetDataUtils.decodeERC20AssetData(
      order.takerAssetData
    ).tokenAddress;
    limitOrder.quoteAddress = assetDataUtils.decodeERC20AssetData(
      order.makerAssetData
    ).tokenAddress;
    limitOrder.price = takerTokenUnitAmount.div(makerTokenUnitAmount);
    limitOrder.amount = makerTokenUnitAmount;
    limitOrder.side = 'sell';
    return limitOrder;
  } else {
    return null;
  }
}

export async function getFillableOrderAmounts(orders, amount = null) {
  if (!orders) return null;
  if (!orders.length) return [];

  const {
    wallet: { web3 }
  } = _store.getState();

  const ethereumClient = new EthereumClient(web3);
  const zeroExClient = new ZeroExClient(ethereumClient);

  const filled = await Promise.all(
    orders.map(order =>
      zeroExClient.getFilledTakerAmount(
        orderHashUtils.getOrderHashHex(order),
        false
      )
    )
  );

  const amounts = orders.map((order, index) =>
    new BigNumber(order.takerAssetAmount).sub(filled[index])
  );

  if (amount === null) {
    return amounts;
  }

  let fillableAmount = new BigNumber(amount);
  const fillableAmounts = [];

  for (let i = 0; i < amounts.length; ++i) {
    let amount = amounts[i];

    if (fillableAmount.lt(amount)) {
      fillableAmounts.push(fillableAmount);
      break;
    } else {
      fillableAmounts.push(new BigNumber(amount));
    }
  }

  return fillableAmounts;
}

export async function createOrder(limitOrder) {
  const {
    wallet: { address, web3 }
  } = _store.getState();
  const ethereumClient = new EthereumClient(web3);
  const zeroExClient = new ZeroExClient(ethereumClient);
  return {
    ...convertLimitOrderToZeroExOrder(limitOrder),
    exchangeAddress: await zeroExClient.getExchangeContractAddress(),
    expirationTimeSeconds: new BigNumber(moment().unix() + 60 * 60 * 24),
    makerAddress: `0x${address.toLowerCase()}`,
    makerFee: ZeroExClient.ZERO,
    senderAddress: ZeroExClient.NULL_ADDRESS,
    takerAddress: ZeroExClient.NULL_ADDRESS,
    takerFee: ZeroExClient.ZERO,
    feeRecipientAddress: ZeroExClient.NULL_ADDRESS,
    salt: generatePseudoRandomSalt()
  };
}

export async function signOrder(order) {
  try {
    const {
      wallet: { web3 }
    } = _store.getState();

    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient);

    if (!order.salt) order.salt = generatePseudoRandomSalt();

    const orderHash = orderHashUtils.getOrderHashHex(order);
    // Halting at signature -- seems like a performance or network issue.
    const signature = await zeroExClient.signOrderHash(orderHash);

    return {
      ...order,
      orderHash,
      signature
    };
  } catch (err) {
    NavigationService.error(err);
    return null;
  }
}
