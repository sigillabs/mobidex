import * as _ from "lodash";
import { handleActions } from "redux-actions";
import * as Actions from "../constants/actions";

const initialState = {
  orders: []
};

export default handleActions({
  [Actions.ADD_ORDERS]: (state, action) => {
    return { ...state, orders: _.unionBy(state.orders, action.payload, "orderHash") };
  }
}, initialState);
