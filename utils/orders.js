import { HttpClient } from '@0xproject/connect';
import { ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import * as _ from 'lodash';

export async function getTokenPairs(options = { relayerEndpoint: null }) {
  let client = new HttpClient(options.relayerEndpoint);
  return await client.getTokenPairsAsync();
}

export async function getOrders(options = { relayerEndpoint: null }) {
  let client = new HttpClient(options.relayerEndpoint);
  return await client.getOrdersAsync();
}

export async function getOrder(hash, options = { relayerEndpoint: null }) {
  let client = new HttpClient(options.relayerEndpoint);
  return await client.getOrderAsync(hash);
}

export function filterAndSortOrdersByTokens(
  orders,
  makerTokenAddress,
  takerTokenAddress
) {
  let ordersToFill = orders;
  ordersToFill = orders.filter(o => o.makerTokenAddress === makerTokenAddress);
  ordersToFill = ordersToFill.filter(
    o => o.takerTokenAddress === takerTokenAddress
  );
  ordersToFill = _.sortBy(
    ordersToFill,
    ({ makerTokenAmount, takerTokenAmount }) => {
      return new BigNumber(takerTokenAmount).div(makerTokenAmount).toNumber();
    }
  );

  return ordersToFill.reverse();
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

  if (fillableTotal.lt(amount)) {
    for (const order of orders) {
      if (
        taker &&
        new BigNumber(order.filledTakerTokenAmount).gte(order.takerTokenAmount)
      ) {
        continue;
      }
      if (
        !taker &&
        new BigNumber(order.filledMakerTokenAmount).gte(order.makerTokenAmount)
      ) {
        continue;
      }
      ordersToFill.push(order);
      fillableTotal = fillableTotal.add(
        taker ? order.takerTokenAmount : order.makerTokenAmount
      );
      fillableTotal = fillableTotal.sub(
        taker ? order.filledTakerTokenAmount : order.filledMakerTokenAmount
      );

      if (fillableTotal.gte(amount)) {
        break;
      }
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
