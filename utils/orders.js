import { BigNumber, orderHashUtils, signatureUtils, SignerType } from '0x.js';

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
    SignerType.Metamask
  );
  return signatureUtils.isValidECSignature(
    prefixedMessage,
    signatureUtils.parseECSignature(order.signature),
    order.makerAddress
  );
}
