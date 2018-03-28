import * as _ from "lodash";
import { handleActions } from "redux-actions";
import * as Actions from "../constants/actions";

const initialState = {
  currency: "USD",
  prices: {}
};

export default handleActions({
  [Actions.SET_FOREX_CURRENCY]: (state, action) => {
    return { ...state, currency: action.payload };
  },
  [Actions.SET_FOREX_PRICE]: (state, action) => {
    let [ currency, price ] = action.payload;
    return { ...state, prices: { ...state.prices, [currency]: price } };
  },
  [Actions.SET_ORDERS]: (state, action) => {
    return { ...state, orders: action.payload };
  },
  [Actions.SET_PRODUCTS]: (state, action) => {
    return { ...state, products: action.payload };
  },
  [Actions.SET_TOKENS]: (state, action) => {
    return { ...state, tokens: action.payload };
  }
}, initialState);
