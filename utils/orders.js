import { ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import * as _ from 'lodash';

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
