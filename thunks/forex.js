import { price } from "../fx/index";
import { setForexPrice } from "../actions";

export function loadForexPrices() {
  return async (dispatch, getState) => {
    let { wallet: { assets } } = getState();

    for (let asset of assets) {
      let forexPrice = await price({ quoteCurrency: "USD", baseCurrency: asset.symbol });
      dispatch(setForexPrice([ asset.symbol, forexPrice ]));
    }
  };
}