import * as _ from "lodash";
import { handleActions } from "redux-actions";
import * as Actions from "../constants/actions";

const initialState = {
  settings: {
    quoteToken: null,
    baseToken: null
  },
  orders: []
};

export default handleActions({
  [Actions.SET_QUOTE_TOKEN]: (state, action) => {
    state.settings.quoteToken = action.payload;
    return state;
  },
  [Actions.SET_BASE_TOKEN]: (state, action) => {
    state.settings.baseToken = action.payload;
    return state;
  },
  [Actions.ADD_ORDERS]: (state, action) => {
    state.orders = _.unionBy(state.orders, action.payload, "orderHash");
    return state;
  }
}, initialState);
