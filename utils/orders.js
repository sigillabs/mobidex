import { BigNumber, orderHashUtils, signatureUtils, SignerType } from '0x.js';
import ethUtil from 'ethereumjs-util';
import * as _ from 'lodash';
import { ZERO } from '../constants/0x';

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
          `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`
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
    .map(([makerAssetAmount, takerAssetAmount]) =>
      takerAssetAmount.gt(0) ? makerAssetAmount.div(takerAssetAmount) : ZERO
    )
    .filter(price => price.gt(0));
  return prices.reduce((acc, price) => acc.add(price), ZERO).div(prices.length);
}

export function averagePriceByTakerAmount(
  orders,
  options = { remainingFillableTakerAssetAmounts: null }
) {
  if (!options) options = { remainingFillableTakerAssetAmounts: null };
  if (!options.remainingFillableTakerAssetAmounts)
    options.remainingFillableTakerAssetAmounts = orders.map(
      ({ takerAssetAmount }) => new BigNumber(takerAssetAmount.toString())
    );
  if (!orders.length) return ZERO;

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
    .map(([makerAssetAmount, takerAssetAmount]) =>
      makerAssetAmount.gt(0) ? takerAssetAmount.div(makerAssetAmount) : ZERO
    )
    .filter(price => price.gt(0));

  return prices.reduce((acc, price) => acc.add(price), ZERO).div(prices.length);
}
