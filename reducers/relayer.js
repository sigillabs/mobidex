import * as _ from "lodash";
import { handleActions } from "redux-actions";
import * as Actions from "../constants/actions";

const initialState = {
  orders: [],
  processing: []
};

export default handleActions({
  [Actions.ADD_ORDERS]: (state, action) => {
    return { ...state, orders: _.unionBy(state.orders, action.payload, "orderHash") };
  },
  [Actions.ADD_PROCESSING_ORDERS]: (state, action) => {
    let processing = _.union(state.processing, action.payload);
    return { ...state, processing: processing };
  },
  [Actions.REMOVE_PROCESSING_ORDERS]: (state, action) => {
    let processing = _.difference(state.processing, action.payload);
    return { ...state, processing: processing };
  }
}, initialState);
