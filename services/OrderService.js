import { ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import * as _ from 'lodash';
import moment from 'moment';
import EthereumClient from '../clients/ethereum';
import ZeroExClient from '../clients/0x';
import { formatProduct } from '../utils';
import NavigationService from './NavigationService';
import * as TokenService from './TokenService';

let _store;

export function setStore(store) {
  _store = store;
}

export function getOrderbook(baseToken, quoteToken = null) {
  const {
    relayer: { orderbooks }
  } = _store.getState();

  if (!quoteToken) {
    quoteToken = TokenService.getQuoteToken();
  } else if (typeof quoteToken === 'string') {
    quoteToken = TokenService.findTokenByAddress(quoteToken);
  }

  if (typeof baseToken === 'string') {
    baseToken = TokenService.findTokenByAddress(baseToken);
  }

  if (!baseToken || !quoteToken) {
    return null;
  }

  const product = formatProduct(baseToken.symbol, quoteToken.symbol);

  return orderbooks[product];
}

export function getOrderPrice(order) {
  const makerToken = TokenService.findTokenByAddress(order.makerTokenAddress);
  const takerToken = TokenService.findTokenByAddress(order.takerTokenAddress);
  const quoteToken = TokenService.getQuoteToken();

  if (!makerToken) return null;
  if (!takerToken) return null;

  const makerTokenUnitAmount = ZeroEx.toUnitAmount(
    new BigNumber(order.makerTokenAmount),
    makerToken.decimals
  );
  const takerTokenUnitAmount = ZeroEx.toUnitAmount(
    new BigNumber(order.takerTokenAmount),
    takerToken.decimals
  );

  if (quoteToken.address === makerToken.address) {
    return makerTokenUnitAmount.div(takerTokenUnitAmount);
  } else if (quoteToken.address === takerToken.address) {
    return takerTokenUnitAmount.div(makerTokenUnitAmount);
  } else {
    return null;
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
    relayer: { tokens }
  } = _store.getState();

  const quoteToken = _.find(tokens, { address: limitOrder.quoteAddress });
  const baseToken = _.find(tokens, { address: limitOrder.baseAddress });

  if (!quoteToken) return null;
  if (!baseToken) return null;

  let order = {
    makerTokenAddress: null,
    makerTokenAmount: null,
    takerTokenAddress: null,
    takerTokenAmount: null
  };

  switch (limitOrder.side) {
    case 'buy':
      order.makerTokenAddress = quoteToken.address;
      order.makerTokenAmount = ZeroEx.toBaseUnitAmount(
        new BigNumber(limitOrder.price).mul(limitOrder.amount).abs(),
        quoteToken.decimals
      );
      order.takerTokenAddress = baseToken.address;
      order.takerTokenAmount = ZeroEx.toBaseUnitAmount(
        new BigNumber(limitOrder.amount).abs(),
        baseToken.decimals
      );
      break;

    case 'sell':
      order.makerTokenAddress = baseToken.address;
      order.makerTokenAmount = ZeroEx.toBaseUnitAmount(
        new BigNumber(limitOrder.amount).abs(),
        baseToken.decimals
      );
      order.takerTokenAddress = quoteToken.address;
      order.takerTokenAmount = ZeroEx.toBaseUnitAmount(
        new BigNumber(limitOrder.price).mul(limitOrder.amount).abs(),
        quoteToken.decimals
      );
      break;
  }

  return order;
}

export function convertZeroExOrderToLimitOrder(order) {
  const {
    relayer: { tokens }
  } = _store.getState();

  const makerToken = _.find(tokens, { address: order.makerTokenAddress });
  const takerToken = _.find(tokens, { address: order.takerTokenAddress });
  const quoteToken = TokenService.getQuoteToken();

  if (!makerToken) return null;
  if (!takerToken) return null;

  const makerTokenUnitAmount = ZeroEx.toUnitAmount(
    new BigNumber(order.makerTokenAmount),
    makerToken.decimals
  );
  const takerTokenUnitAmount = ZeroEx.toUnitAmount(
    new BigNumber(order.takerTokenAmount),
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
    limitOrder.baseAddress = order.takerTokenAddress;
    limitOrder.quoteAddress = order.makerTokenAddress;
    limitOrder.price = makerTokenUnitAmount.div(takerTokenUnitAmount);
    limitOrder.amount = takerTokenUnitAmount;
    limitOrder.side = 'buy';
    return limitOrder;
  } else if (quoteToken.address === takerToken.address) {
    limitOrder.baseAddress = order.takerTokenAddress;
    limitOrder.quoteAddress = order.makerTokenAddress;
    limitOrder.price = takerTokenUnitAmount.div(makerTokenUnitAmount);
    limitOrder.amount = makerTokenUnitAmount;
    limitOrder.side = 'sell';
    return limitOrder;
  } else {
    return null;
  }
}

export function convertZeroExOrderToOrderRequest(order, amount = null) {
  if (!order) return null;
  if (new BigNumber(order.filledTakerTokenAmount).gte(order.takerTokenAmount)) {
    return null;
  }

  const quoteToken = TokenService.getQuoteToken();
  let amountProperty;
  let filledProperty;
  let tokenAddress;

  if (quoteToken.address === order.makerTokenAddress) {
    tokenAddress = order.takerTokenAddress;
    amountProperty = 'takerTokenAmount';
    filledProperty = 'filledTakerTokenAmount';
  } else if (quoteToken.address === order.takerTokenAddress) {
    tokenAddress = order.makerTokenAddress;
    amountProperty = 'makerTokenAmount';
    filledProperty = 'filledMakerTokenAmount';
  } else {
    throw new Error('Quote token not in order.');
  }

  if (new BigNumber(order[filledProperty]).gte(order[amountProperty])) {
    return null;
  }

  const baseToken = TokenService.findTokenByAddress(tokenAddress);
  const fillable = new BigNumber(order[amountProperty]).sub(
    order[filledProperty]
  );
  const amountBN = ZeroEx.toBaseUnitAmount(
    new BigNumber(amount || 0),
    baseToken.decimals
  );

  if (amount === null || amountBN.gt(fillable)) {
    return {
      signedOrder: order,
      takerTokenFillAmount: new BigNumber(order.takerTokenAmount).sub(
        order.filledTakerTokenAmount
      )
    };
  } else {
    const ratio = amountBN.div(order[amountProperty]);
    let fillAmount = ratio.mul(order.takerTokenAmount);

    // Rounding does not work
    // Big hack
    if (fillAmount.dp() > 0) {
      fillAmount = new BigNumber(
        fillAmount.toString().slice(0, -1 - fillAmount.dp())
      );
    }

    const maxFillAmount = new BigNumber(order.takerTokenAmount).sub(
      order.filledTakerTokenAmount
    );
    const takerTokenFillAmount = fillAmount.gt(maxFillAmount)
      ? maxFillAmount
      : fillAmount;

    if (takerTokenFillAmount.lte(0)) {
      return null;
    }

    return {
      signedOrder: order,
      takerTokenFillAmount
    };
  }
}

export function convertZeroExOrdersToOrderRequests(orders, amount = null) {
  if (!orders) return null;
  if (!orders.length) return [];

  if (amount === null || amount === undefined) {
    return orders.map(o => convertZeroExOrderToOrderRequest(o, null));
  } else {
    const orderRequests = [];
    let amountBN = new BigNumber(amount);
    for (const order of orders) {
      const orderRequest = convertZeroExOrderToOrderRequest(order, amount);
      if (orderRequest === null) {
        break;
      }
      orderRequests.push(orderRequest);
      amountBN = amountBN.sub(orderRequest.takerTokenFillAmount);
    }
    return orderRequests;
  }
}

export async function createOrder(limitOrder) {
  const {
    wallet: { address, web3 }
  } = _store.getState();
  const ethereumClient = new EthereumClient(web3);
  const zeroExClient = new ZeroExClient(ethereumClient);
  return {
    ...convertLimitOrderToZeroExOrder(limitOrder),
    maker: `0x${address.toLowerCase()}`,
    makerFee: new BigNumber(0),
    taker: ZeroEx.NULL_ADDRESS,
    takerFee: new BigNumber(0),
    expirationUnixTimestampSec: new BigNumber(moment().unix() + 60 * 60 * 24),
    feeRecipient: ZeroEx.NULL_ADDRESS,
    salt: ZeroEx.generatePseudoRandomSalt(),
    exchangeContractAddress: await zeroExClient.getZeroExContractAddress()
  };
}

export async function signOrder(order) {
  try {
    const {
      wallet: { web3 }
    } = _store.getState();

    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient);
    const zeroEx = await zeroExClient.getZeroExClient();
    const account = await ethereumClient.getAccount();

    if (!order.salt) order.salt = ZeroEx.generatePseudoRandomSalt();

    const hash = ZeroEx.getOrderHashHex(order);
    // Halting at signature -- seems like a performance or network issue.
    const ecSignature = await zeroEx.signOrderHashAsync(
      hash,
      account.toLowerCase()
    );

    return {
      ...order,
      orderHash: hash,
      ecSignature
    };
  } catch (err) {
    NavigationService.error(err);
    return null;
  }
}
