import { BigNumber } from '0x.js';

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
