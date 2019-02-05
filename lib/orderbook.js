import { BigNumber } from '0x.js';
import { RBTree } from 'bintrees';

function compareAsks(orderA, orderB) {
  if (orderA.orderHash === orderB.orderHash) {
    return 0;
  }

  const priceA = new BigNumber(orderA.takerAssetAmount).div(
    orderA.makerAssetAmount
  );
  const priceB = new BigNumber(orderB.takerAssetAmount).div(
    orderB.makerAssetAmount
  );

  if (!priceA.eq(priceB)) {
    return priceA.sub(priceB).toNumber();
  }

  return new BigNumber(orderA.salt).sub(orderB.salt).toNumber();
}

function compareBids(orderA, orderB) {
  if (orderA.orderHash === orderB.orderHash) {
    return 0;
  }

  const priceA = new BigNumber(orderA.makerAssetAmount).div(
    orderA.takerAssetAmount
  );
  const priceB = new BigNumber(orderB.makerAssetAmount).div(
    orderB.takerAssetAmount
  );

  if (!priceA.eq(priceB)) {
    return priceA
      .sub(priceB)
      .negated()
      .toNumber();
  }

  return new BigNumber(orderA.salt)
    .sub(orderB.salt)
    .negated()
    .toNumber();
}

export default class Orderbook {
  constructor(baseAssetData, quoteAssetData) {
    this.baseAssetData = baseAssetData;
    this.quoteAssetData = quoteAssetData;
    this.bids = new RBTree(compareBids);
    this.asks = new RBTree(compareAsks);
  }

  add(order) {
    if (
      this.baseAssetData === order.makerAssetData &&
      this.quoteAssetData === order.takerAssetData
    ) {
      this.asks.insert(order);
    } else if (
      this.baseAssetData === order.takerAssetData &&
      this.quoteAssetData === order.makerAssetData
    ) {
      this.bids.insert(order);
    } else {
      throw new Error('Order being added to the wrong orderbook.');
    }
  }

  highestBid() {
    return this.bids.min();
  }

  lowestAsk() {
    return this.asks.min();
  }

  iterateOverBids() {
    return this.bids.iterator();
  }

  iterateOverAsks() {
    return this.asks.iterator();
  }

  bidsArray() {
    const result = [];
    let it = this.iterateOverBids();
    let item = null;
    while ((item = it.next()) !== null) {
      result.push(item);
    }
    return result;
  }

  asksArray() {
    const result = [];
    let it = this.iterateOverAsks();
    let item = null;
    while ((item = it.next()) !== null) {
      result.push(item);
    }
    return result;
  }

  serializable() {
    return {
      asks: this.asksArray(),
      bids: this.bidsArray()
    };
  }
}
