import BigNumber from 'bignumber.js';
import * as _ from 'lodash';
import { ZeroEx, Order as UnsignedOrder, SignedOrder } from '0x.js';
import { getZeroExClient, getAccount } from './ethereum';

export function convertLimitOrderToZeroExOrder(
  price,
  amount,
  base,
  quote,
  side
) {
  let order = {
    makerTokenAddress: null,
    makerTokenAmount: null,
    takerTokenAddress: null,
    takerTokenAmount: null
  };

  switch (side) {
    case 'buy':
      order.makerTokenAddress = quote.address;
      order.makerTokenAmount = ZeroEx.toBaseUnitAmount(
        new BigNumber(price).mul(amount),
        quote.decimals
      );
      order.takerTokenAddress = base.address;
      order.takerTokenAmount = ZeroEx.toBaseUnitAmount(
        new BigNumber(amount),
        base.decimals
      );
      break;

    case 'sell':
      order.makerTokenAddress = base.address;
      order.makerTokenAmount = ZeroEx.toBaseUnitAmount(
        new BigNumber(amount),
        base.decimals
      );
      order.takerTokenAddress = quote.address;
      order.takerTokenAmount = ZeroEx.toBaseUnitAmount(
        new BigNumber(price).mul(amount),
        quote.decimals
      );
      break;
  }

  return order;
}

export async function signOrder(web3, order) {
  const zeroEx = await getZeroExClient(web3);
  const account = await getAccount(web3);

  order.salt = ZeroEx.generatePseudoRandomSalt();

  const hash = ZeroEx.getOrderHashHex(order);
  // Halting at signature -- seems like a performance issue.
  // Actually a network request issue.
  const ecSignature = await zeroEx.signOrderHashAsync(
    hash,
    account.toLowerCase()
  );
  const { v, r, s } = ecSignature;

  return {
    ...order,
    orderHash: hash,
    ecSignature
  };
}

export async function batchFillOrKill(web3, orders, amount = null) {
  if (orders.length === 1) {
    return await fillOrKillOrder(web3, orders[0], amount);
  }

  const zeroEx = await getZeroExClient(web3);
  const account = await getAccount(web3);
  let amountBN =
    amount === null
      ? `${new BigNumber(2)
          .pow(256)
          .minus(1)
          .toString()}`
      : new BigNumber(amount);

  zeroEx.exchange.batchFillOrKillAsync(
    orders.map(o => {
      if (amountBN.gt(o.takerTokenAmount)) {
        amountBN = amountBN.sub(o.takerTokenAmount);
        return {
          signedOrder: o,
          takerTokenFillAmount: new BigNumber(o.takerTokenAmount)
        };
      } else {
        return {
          signedOrder: o,
          takerTokenFillAmount: new BigNumber(amountBN)
        };
      }
    }),
    account.toLowerCase(),
    { shouldValidate: true }
  );
}

export async function fillOrKillOrder(web3, order, amount = null) {
  const zeroEx = await getZeroExClient(web3);
  const account = await getAccount(web3);
  const amountBN =
    amount !== null
      ? new BigNumber(amount)
      : new BigNumber(order.takerTokenAmount);
  return await zeroEx.exchange.fillOrderAsync(
    order,
    amountBN.lte(order.takerTokenAmount) && amountBN.gt(0)
      ? amountBN
      : new BigNumber(order.takerTokenAmount),
    true,
    account.toLowerCase(),
    { shouldValidate: true }
  );
}

export async function fillOrder(web3, order, amount = null) {
  const zeroEx = await getZeroExClient(web3);
  const account = await getAccount(web3);
  const amountBN =
    amount !== null
      ? new BigNumber(amount)
      : new BigNumber(order.takerTokenAmount);
  return await zeroEx.exchange.fillOrderAsync(
    order,
    amountBN.lte(order.takerTokenAmount) && amountBN.gt(0)
      ? amountBN
      : new BigNumber(order.takerTokenAmount),
    true,
    account.toLowerCase()
  );
}

export async function cancelOrder(web3, order, amount) {
  const zeroEx = await getZeroExClient(web3);
  return await zeroEx.exchange.cancelOrderAsync(order, new BigNumber(amount));
}

export function calculateAmount(order, quote, base) {
  if (order.makerTokenAddress === quote.address) {
    return ZeroEx.toUnitAmount(
      new BigNumber(order.takerTokenAmount),
      base.decimals
    );
  } else {
    return ZeroEx.toUnitAmount(
      new BigNumber(order.makerTokenAmount),
      base.decimals
    );
  }
}

export function calculatePrice(order, quote, base) {
  if (order.makerTokenAddress === quote.address) {
    let quoteAmount = ZeroEx.toUnitAmount(
      new BigNumber(order.makerTokenAmount),
      quote.decimals
    );
    let amount = ZeroEx.toUnitAmount(
      new BigNumber(order.takerTokenAmount),
      base.decimals
    );
    return quoteAmount.div(amount);
  } else {
    let quoteAmount = ZeroEx.toUnitAmount(
      new BigNumber(order.takerTokenAmount),
      quote.decimals
    );
    let amount = ZeroEx.toUnitAmount(
      new BigNumber(order.makerTokenAmount),
      base.decimals
    );
    return quoteAmount.div(amount);
  }
}

export function calculateBidPrice(order, quote, base) {
  let quoteAmount = ZeroEx.toUnitAmount(
    new BigNumber(order.makerTokenAmount),
    quote.decimals
  );
  let amount = ZeroEx.toUnitAmount(
    new BigNumber(order.takerTokenAmount),
    base.decimals
  );
  return quoteAmount.div(amount);
}

export function calculateAskPrice(order, quote, base) {
  let quoteAmount = ZeroEx.toUnitAmount(
    new BigNumber(order.takerTokenAmount),
    quote.decimals
  );
  let amount = ZeroEx.toUnitAmount(
    new BigNumber(order.makerTokenAmount),
    base.decimals
  );
  return quoteAmount.div(amount);
}

export function findHighestBid(orders, quote, base) {
  let highestBid = null;

  for (let order of orders) {
    if (quote.address === order.makerTokenAddress) {
      if (highestBid === null) {
        highestBid = order;
      } else if (
        calculateBidPrice(order, quote, base).gt(
          calculateBidPrice(highestBid, quote, base)
        )
      ) {
        highestBid = order;
      }
    }
  }

  return highestBid;
}

export function findLowestAsk(orders, quote, base) {
  let lowestAsk = null;

  for (let order of orders) {
    if (quote.address === order.takerTokenAddress) {
      if (lowestAsk === null) {
        lowestAsk = order;
      } else if (
        calculateAskPrice(order, quote, base).lt(
          calculateAskPrice(lowestAsk, quote, base)
        )
      ) {
        lowestAsk = order;
      }
    }
  }

  return lowestAsk;
}

export function productTokenAddresses(products, attr) {
  let tokenA = [],
    tokenB = [];

  switch (attr) {
    case 'tokenA':
      tokenA = products.map(p => p.tokenA.address);
      break;

    case 'tokenB':
      tokenB = products.map(p => p.tokenB.address);
      break;

    default:
      tokenA = products.map(p => p.tokenA.address);
      tokenB = products.map(p => p.tokenB.address);
      break;
  }

  return _.uniq(tokenA.concat(tokenB));
}

export function filterAndSortOrdersByTokens(orders, base, quote, side) {
  let ordersToFill;
  switch (side) {
    case 'buy':
      ordersToFill = orders.filter(o => o.makerTokenAddress === quote.address);
      ordersToFill = orders.filter(o => o.takerTokenAddress === base.address);
      ordersToFill = _.sortBy(
        ordersToFill,
        ({ makerTokenAmount, takerTokenAmount }) => {
          return new BigNumber(takerTokenAmount)
            .div(makerTokenAmount)
            .toNumber();
        }
      );
      break;

    case 'sell':
      ordersToFill = orders.filter(o => o.makerTokenAddress === base.address);
      ordersToFill = orders.filter(o => o.takerTokenAddress === quote.address);
      ordersToFill = _.sortBy(
        ordersToFill,
        ({ makerTokenAmount, takerTokenAmount }) => {
          return new BigNumber(makerTokenAmount)
            .div(takerTokenAmount)
            .toNumber();
        }
      );
      ordersToFill.reverse();
      break;

    default:
      return [];
  }

  return ordersToFill;
}

export function filterAndSortOrdersByTokensAndTakerAddress(
  orders,
  base,
  quote,
  side,
  taker = ZeroEx.NULL_ADDRESS
) {
  return filterAndSortOrdersByTokens(orders, base, quote, side).filter(
    o => o.taker === taker
  );
}

export function filterOrdersToBaseAmount(amount, orders, side) {
  const ordersToFill = [];
  let fillableTotal = new BigNumber(0);
  for (const order of orders) {
    ordersToFill.push(order);
    fillableTotal = fillableTotal.add(
      side == 'buy' ? order.makerTokenAmount : order.takerTokenAmount
    );

    if (fillableTotal.gte(amount)) {
      break;
    }
  }

  return ordersToFill;
}

export function getOrdersToFill(amount, orders, base, quote, side) {
  return filterOrdersToBaseAmount(
    amount,
    filterAndSortOrdersByTokensAndTakerAddress(orders, base, quote, side),
    base,
    quote,
    side
  );
}
