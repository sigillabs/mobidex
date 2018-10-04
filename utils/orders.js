import { BigNumber, orderHashUtils, signatureUtils, SignerType } from '0x.js';

export function findOrdersThatCoverMakerAssetFillAmount(
  orders,
  takerAssetAmount,
  options
) {
  if (!orders || !orders.length) return [];
  if (!options) options = {};
  takerAssetAmount = new BigNumber(takerAssetAmount);

  const remainingFillableTakerAssetAmounts =
    options.remainingFillableTakerAssetAmounts || [];
  const result = [];

  for (let i = 0; i < orders.length; ++i) {
    if (takerAssetAmount.lte(0)) {
      break;
    }

    if (remainingFillableTakerAssetAmounts[i]) {
      takerAssetAmount = takerAssetAmount.sub(
        remainingFillableTakerAssetAmounts[i]
      );
    } else {
      takerAssetAmount = takerAssetAmount.sub(orders[i].takerAssetAmount);
    }

    result.push(orders[i]);
  }

  return result;
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
