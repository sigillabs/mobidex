import BigNumber from "bignumber.js";
import * as _ from "lodash";
import { ZeroEx, Order as UnsignedOrder, SignedOrder } from "0x.js";
import { getZeroExClient, getAccount } from "./ethereum";

export function convertLimitOrderToZeroExOrder(quoteToken, baseToken, side, price, amount) {
  let order = {
    makerTokenAddress: null,
    makerTokenAmount: null,
    takerTokenAddress: null,
    takerTokenAmount: null
  };

  switch(side) {
    case "bid":
    order.makerTokenAddress = quoteToken.address;
    order.makerTokenAmount = ZeroEx.toBaseUnitAmount(new BigNumber(price).mul(amount), quoteToken.decimals);
    order.takerTokenAddress = baseToken.address;
    order.takerTokenAmount = ZeroEx.toBaseUnitAmount(new BigNumber(amount), baseToken.decimals);
    break;

    case "ask":
    order.makerTokenAddress = baseToken.address;
    order.makerTokenAmount = ZeroEx.toBaseUnitAmount(new BigNumber(amount), baseToken.decimals);
    order.takerTokenAddress = quoteToken.address;
    order.takerTokenAmount = ZeroEx.toBaseUnitAmount(new BigNumber(price).mul(amount), quoteToken.decimals);
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

export async function cancelOrder(web3, order, amount) {
  const zeroEx = await getZeroExClient(web3);
  return await zeroEx.exchange.cancelOrderAsync(order, new BigNumber(amount));
}

export function calculateBidPrice(order, quoteToken, baseToken) {
  let quote = ZeroEx.toUnitAmount(new BigNumber(order.makerTokenAmount), quoteToken.decimals);
  let amount = ZeroEx.toUnitAmount(new BigNumber(order.takerTokenAmount), baseToken.decimals);
  return quote.div(amount);
}

export function calculateAskPrice(order, quoteToken, baseToken) {
  let quote = ZeroEx.toUnitAmount(new BigNumber(order.takerTokenAmount), quoteToken.decimals);
  let amount = ZeroEx.toUnitAmount(new BigNumber(order.makerTokenAmount), baseToken.decimals);
  return quote.div(amount);
}

export function findHighestBid(orders, quoteToken, baseToken) {
  let highestBid = null;

  for (let order of orders) {
    if (quoteToken.address === order.makerTokenAddress) {
      if (highestBid === null) {
        highestBid = order;
      } else if (calculateBidPrice(order, quoteToken, baseToken).gt(calculateBidPrice(highestBid, quoteToken, baseToken))) {
        highestBid = order;
      }
    }
  }

  return highestBid;
}

export function findLowestAsk(orders, quoteToken, baseToken) {
  let lowestAsk = null;

  for (let order of orders) {
    if (quoteToken.address === order.takerTokenAddress) {
      if (lowestAsk === null) {
        lowestAsk = order;
      } else if (calculateAskPrice(order, quoteToken, baseToken).lt(calculateAskPrice(lowestAsk, quoteToken, baseToken))) {
        lowestAsk = order;
      }
    }
  }

  return lowestAsk;
}

export function productTokenAddresses(products, attr) {
  let tokenA = [], tokenB = [];

  switch(attr) {
    case "tokenA":
    tokenA = products.map(p => p.tokenA.address);
    break;

    case "tokenB":
    tokenB = products.map(p => p.tokenB.address);
    break;

    default:
    tokenA = products.map(p => p.tokenA.address);
    tokenB = products.map(p => p.tokenB.address);
    break;
  }

  return _.uniq(tokenA.concat(tokenB));
}
