import { orderParsingUtils } from '@0xproject/order-utils';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { BigNumber, orderHashUtils, signatureUtils, SignerType } from '0x.js';
import * as _ from 'lodash';
import { ZERO } from '../../constants/0x';
import { formatHexString } from './format';

export function findOrdersThatCoverTakerAssetFillAmount(
  orders,
  takerAssetAmount,
  options
) {
  if (!orders || !orders.length) return [];
  if (!options) options = {};
  let remainingFillAmount = new BigNumber(takerAssetAmount);

  const remainingFillableTakerAssetAmounts =
    options.remainingFillableTakerAssetAmounts || [];
  const resultOrders = [];
  const ordersRemainingFillableTakerAssetAmounts = [];

  for (let i = 0; i < orders.length; ++i) {
    if (remainingFillAmount.lte(0)) {
      break;
    }

    if (remainingFillableTakerAssetAmounts[i]) {
      ordersRemainingFillableTakerAssetAmounts.push(
        remainingFillableTakerAssetAmounts[i]
      );
      remainingFillAmount = remainingFillAmount.sub(
        remainingFillableTakerAssetAmounts[i]
      );
    } else {
      ordersRemainingFillableTakerAssetAmounts.push(orders[i].takerAssetAmount);
      remainingFillAmount = remainingFillAmount.sub(orders[i].takerAssetAmount);
    }

    resultOrders.push(orders[i]);
  }

  return {
    ordersRemainingFillableTakerAssetAmounts,
    remainingFillAmount,
    resultOrders
  };
}

export function isValidSignedOrder(order) {
  const hash = orderHashUtils.getOrderHashHex(order);
  const prefixedMessage = signatureUtils.addSignedMessagePrefix(
    hash,
    SignerType.Default
  );
  return signatureUtils.isValidECSignature(
    prefixedMessage,
    signatureUtils.parseECSignature(order.signature),
    order.makerAddress
  );
}

export async function filterFillableOrders(wrappers, orders) {
  const fillable = await Promise.all(
    orders.map(async order => {
      try {
        await wrappers.exchange.validateOrderFillableOrThrowAsync(order);
        return [true, order];
      } catch (err) {
        return [false, order];
      }
    })
  );
  return fillable.filter(status => status[0]).map(status => status[1]);
}

export async function filterTestOrderFill(wrappers, orders, amount, account) {
  const fillable = await Promise.all(
    orders.map(async order => {
      try {
        await wrappers.exchange.validateFillOrderThrowIfInvalidAsync(
          order,
          new BigNumber(amount),
          formatHexString(account.toString())
        );
        return [true, order];
      } catch (err) {
        return [false, order];
      }
    })
  );
  return fillable.filter(status => status[0]).map(status => status[1]);
}

export function averagePriceByMakerAmount(
  orders,
  options = { remainingFillableMakerAssetAmounts: null }
) {
  if (!options) options = { remainingFillableMakerAssetAmounts: null };
  if (!options.remainingFillableMakerAssetAmounts)
    options.remainingFillableMakerAssetAmounts = orders.map(
      ({ makerAssetAmount }) => new BigNumber(makerAssetAmount.toString())
    );
  if (!orders.length) return ZERO;

  const ratios = _.zip(orders, options.remainingFillableMakerAssetAmounts).map(
    ([{ makerAssetAmount }, remainingMakerAssetAmount]) =>
      remainingMakerAssetAmount.div(makerAssetAmount)
  );
  const remainingFillableTakerAssetAmounts = _.zip(orders, ratios).map(
    ([{ takerAssetAmount }, ratio]) =>
      new BigNumber(
        new BigNumber(takerAssetAmount.toString())
          .mul(ratio)
          .toFixed(0, BigNumber.ROUND_FLOOR)
      )
  );
  const prices = _.zip(
    options.remainingFillableMakerAssetAmounts,
    remainingFillableTakerAssetAmounts
  )
    .map(([makerAssetAmount, takerAssetAmount]) => [
      Web3Wrapper.toBaseUnitAmount(
        makerAssetAmount,
        options.makerAssetDecimals
      ),
      Web3Wrapper.toBaseUnitAmount(takerAssetAmount, options.takerAssetDecimals)
    ])
    .map(([makerAssetAmount, takerAssetAmount]) =>
      takerAssetAmount.gt(0) ? makerAssetAmount.div(takerAssetAmount) : ZERO
    )
    .filter(price => price.gt(0));
  return prices.reduce((acc, price) => acc.add(price), ZERO).div(prices.length);
}

export function averagePriceByTakerAmount(
  orders,
  options = {
    remainingFillableTakerAssetAmounts: null,
    makerAssetDecimals: 18,
    takerAssetDecimals: 18
  }
) {
  if (!options) options = { remainingFillableTakerAssetAmounts: null };
  if (!options.remainingFillableTakerAssetAmounts)
    options.remainingFillableTakerAssetAmounts = orders.map(
      ({ takerAssetAmount }) => new BigNumber(takerAssetAmount.toString())
    );
  if (!orders.length) return ZERO;
  if (!options.makerAssetDecimals) options.makerAssetDecimals = 18;
  if (!options.takerAssetDecimals) options.takerAssetDecimals = 18;

  const ratios = _.zip(orders, options.remainingFillableTakerAssetAmounts).map(
    ([{ takerAssetAmount }, remainingTakerAssetAmount]) =>
      remainingTakerAssetAmount.div(takerAssetAmount)
  );
  const remainingFillableMakerAssetAmounts = _.zip(orders, ratios).map(
    ([{ makerAssetAmount }, ratio]) =>
      new BigNumber(
        new BigNumber(makerAssetAmount.toString())
          .mul(ratio)
          .toFixed(0, BigNumber.ROUND_FLOOR)
      )
  );
  const prices = _.zip(
    remainingFillableMakerAssetAmounts,
    options.remainingFillableTakerAssetAmounts
  )
    .map(([makerAssetAmount, takerAssetAmount]) => [
      Web3Wrapper.toBaseUnitAmount(
        makerAssetAmount,
        options.makerAssetDecimals
      ),
      Web3Wrapper.toBaseUnitAmount(takerAssetAmount, options.takerAssetDecimals)
    ])
    .map(([makerAssetAmount, takerAssetAmount]) =>
      makerAssetAmount.gt(0) ? takerAssetAmount.div(makerAssetAmount) : ZERO
    )
    .filter(price => price.gt(0));

  return prices.reduce((acc, price) => acc.add(price), ZERO).div(prices.length);
}

export function feeForMaker(
  orders,
  makerAmount,
  options = {
    remainingFillableMakerAssetAmounts: null,
    makerAssetDecimals: 18,
    takerAssetDecimals: 18
  }
) {
  if (!options) options = { remainingFillableMakerAssetAmounts: null };
  if (!options.remainingFillableMakerAssetAmounts)
    options.remainingFillableMakerAssetAmounts = orders.map(
      ({ makerAssetAmount }) => new BigNumber(makerAssetAmount.toString())
    );
  if (!orders.length) return ZERO;
  if (!options.makerAssetDecimals) options.makerAssetDecimals = 18;
  if (!options.takerAssetDecimals) options.takerAssetDecimals = 18;

  let fees = ZERO;
  let remainingAmount = new BigNumber(makerAmount);
  for (let i = 0; i < orders.length; ++i) {
    const { makerFee, makerAssetAmount } = orders[i];
    const remainingFillableMakerAssetAmount =
      options.remainingFillableMakerAssetAmounts[i];
    if (!remainingAmount.gt(remainingFillableMakerAssetAmount)) {
      fees = remainingAmount
        .div(makerAssetAmount)
        .mul(makerFee)
        .add(fees);
      break;
    }

    remainingAmount = remainingAmount.sub(remainingFillableMakerAssetAmount);
    fees = remainingFillableMakerAssetAmount
      .div(makerAssetAmount)
      .mul(makerFee)
      .add(fees);
  }

  return new BigNumber(fees.toFixed(0, BigNumber.ROUND_FLOOR));
}

export function feeForTaker(
  orders,
  takerAmount,
  options = { remainingFillableTakerAssetAmounts: null }
) {
  if (!options) options = { remainingFillableTakerAssetAmounts: null };
  if (!options.remainingFillableTakerAssetAmounts)
    options.remainingFillableTakerAssetAmounts = orders.map(
      ({ takerAssetAmount }) => new BigNumber(takerAssetAmount.toString())
    );
  if (!orders.length) return ZERO;

  let fees = ZERO;
  let remainingAmount = new BigNumber(takerAmount);
  for (let i = 0; i < orders.length; ++i) {
    const { takerFee, takerAssetAmount } = orders[i];
    const remainingFillableTakerAssetAmount =
      options.remainingFillableTakerAssetAmounts[i];
    if (!remainingAmount.gt(remainingFillableTakerAssetAmount)) {
      fees = remainingAmount
        .div(takerAssetAmount)
        .mul(takerFee)
        .add(fees);
      break;
    }

    remainingAmount = remainingAmount.sub(remainingFillableTakerAssetAmount);
    fees = remainingFillableTakerAssetAmount
      .div(takerAssetAmount)
      .mul(takerFee)
      .add(fees);
  }

  return new BigNumber(fees.toFixed(0, BigNumber.ROUND_FLOOR));
}

export function takerAmountFromMakerAmount(
  orders,
  makerAmount,
  options = {
    remainingFillableMakerAssetAmounts: null
  }
) {
  if (!options) options = { remainingFillableMakerAssetAmounts: null };
  if (!options.remainingFillableMakerAssetAmounts)
    options.remainingFillableMakerAssetAmounts = orders.map(
      ({ makerAssetAmount }) => new BigNumber(makerAssetAmount.toString())
    );
  if (!orders.length) return ZERO;

  let takerAmount = ZERO;
  let remainingMakerAmount = new BigNumber(makerAmount);
  for (let i = 0; i < orders.length; ++i) {
    const { makerAssetAmount, takerAssetAmount } = orders[i];
    const remainingFillableMakerAssetAmount =
      options.remainingFillableMakerAssetAmounts[i];
    if (!remainingMakerAmount.gt(remainingFillableMakerAssetAmount)) {
      takerAmount = remainingMakerAmount
        .div(makerAssetAmount)
        .mul(takerAssetAmount)
        .add(takerAmount);
      break;
    }

    remainingMakerAmount = remainingMakerAmount.sub(
      remainingFillableMakerAssetAmount
    );
    takerAmount = remainingFillableMakerAssetAmount
      .div(makerAssetAmount)
      .mul(takerAssetAmount)
      .add(takerAmount);
  }

  return new BigNumber(takerAmount.toFixed(0, BigNumber.ROUND_FLOOR));
}

export function makerAmountFromTakerAmount(
  orders,
  takerAmount,
  options = { remainingFillableTakerAssetAmounts: null }
) {
  if (!options) options = { remainingFillableTakerAssetAmounts: null };
  if (!options.remainingFillableTakerAssetAmounts)
    options.remainingFillableTakerAssetAmounts = orders.map(
      ({ takerAssetAmount }) => new BigNumber(takerAssetAmount.toString())
    );
  if (!orders.length) return ZERO;

  let makerAmount = ZERO;
  let remainingTakerAmount = new BigNumber(takerAmount);
  for (let i = 0; i < orders.length; ++i) {
    const { makerAssetAmount, takerAssetAmount } = orders[i];
    const remainingFillableTakerAssetAmount =
      options.remainingFillableTakerAssetAmounts[i];
    if (!remainingTakerAmount.gt(remainingFillableTakerAssetAmount)) {
      makerAmount = remainingTakerAmount
        .div(takerAssetAmount)
        .mul(makerAssetAmount)
        .add(makerAmount);
      break;
    }

    remainingTakerAmount = remainingTakerAmount.sub(
      remainingFillableTakerAssetAmount
    );
    makerAmount = remainingFillableTakerAssetAmount
      .div(takerAssetAmount)
      .mul(makerAssetAmount)
      .add(makerAmount);
  }

  return new BigNumber(makerAmount.toFixed(0, BigNumber.ROUND_FLOOR));
}

export function fixOrders(orders) {
  if (!orders) return null;
  return orders
    .filter(order => Boolean(order))
    .map(orderParsingUtils.convertOrderStringFieldsToBigNumber);
}
