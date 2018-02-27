import BigNumber from "bignumber.js";
import * as _ from "lodash";
import { ZeroEx, Order as UnsignedOrder, SignedOrder } from "0x.js";
import { getZeroExClient, getAccount } from "./ethereum";

export async function signOrder(web3, order) {
  const zeroEx = await getZeroExClient(web3);
  const account = await getAccount(web3);

  order.salt = ZeroEx.generatePseudoRandomSalt();

  const hash = ZeroEx.getOrderHashHex(order);
  // Halting at signature -- seems like a performance issue.
  // Actually a network request issue.
  const ecSignature = await zeroEx.signOrderHashAsync(hash, account.toLowerCase());
  const { v, r, s } = ecSignature;

  return {
    ...order,
    orderHash: hash,
    ecSignature
  };
}

export async function fillOrder(web3, order) {
  const zeroEx = await getZeroExClient(web3);
  const account = await getAccount(web3);
  return await zeroEx.exchange.fillOrderAsync(order, order.takerTokenAmount, true, account.toLowerCase());
}

export async function cancelOrder(web3, order) {
  const zeroEx = await getZeroExClient(web3);
  return await zeroEx.exchange.cancelOrderAsync(order);
}

export function calculateBidPrice(order) {
  return new BigNumber(order.makerTokenAmount).div(order.takerTokenAmount);
}

export function calculateAskPrice(order) {
  return new BigNumber(order.takerTokenAmount).div(order.makerTokenAmount);
}

export function findHighestBid(orders, quoteToken) {
  let highestBid = null;

  for (let order of orders) {
    if (quoteToken.address === order.makerTokenAddress) {
      if (highestBid === null) {
        highestBid = order;
      } else if (calculateBidPrice(order).gt(calculateBidPrice(highestBid))) {
        highestBid = order;
      }
    }
  }

  return highestBid;
}

export function findLowestAsk(orders, quoteToken) {
  let lowestAsk = null;

  for (let order of orders) {
    if (quoteToken.address === order.takerTokenAddress) {
      if (lowestAsk === null) {
        lowestAsk = order;
      } else if (calculateAskPrice(order).lt(calculateAskPrice(lowestAsk))) {
        lowestAsk = order;
      }
    }
  }

  return lowestAsk;
}
