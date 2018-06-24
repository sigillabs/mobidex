import { ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import * as _ from 'lodash';

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

export function filterAndSortOrdersByTokens(
  orders,
  makerTokenAddress,
  takerTokenAddress
) {
  let ordersToFill = orders;
  ordersToFill = orders.filter(o => o.makerTokenAddress === makerTokenAddress);
  ordersToFill = orders.filter(o => o.takerTokenAddress === takerTokenAddress);
  ordersToFill = _.sortBy(
    ordersToFill,
    ({ makerTokenAmount, takerTokenAmount }) => {
      return new BigNumber(takerTokenAmount).div(makerTokenAmount).toNumber();
    }
  );

  return ordersToFill;
}

export function filterAndSortOrdersByTokensAndTakerAddress(
  orders,
  makerTokenAddress,
  takerTokenAddress,
  taker = ZeroEx.NULL_ADDRESS
) {
  return filterAndSortOrdersByTokens(
    orders,
    makerTokenAddress,
    takerTokenAddress
  ).filter(o => o.taker === taker);
}

export function filterOrdersToBaseAmount(orders, amount, taker = false) {
  const ordersToFill = [];
  let fillableTotal = new BigNumber(0);
  for (const order of orders) {
    ordersToFill.push(order);
    fillableTotal = fillableTotal.add(
      taker ? order.takerTokenAmount : order.makerTokenAmount
    );

    if (fillableTotal.gte(amount)) {
      break;
    }
  }

  return ordersToFill;
}

export function getOrdersToFill(
  orders,
  makerTokenAddress,
  takerTokenAddress,
  amount,
  taker = false
) {
  return filterOrdersToBaseAmount(
    filterAndSortOrdersByTokensAndTakerAddress(
      orders,
      makerTokenAddress,
      takerTokenAddress
    ),
    amount,
    taker
  );
}
