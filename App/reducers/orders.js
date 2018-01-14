import * as _ from "lodash";
import { handleActions } from "redux-actions";
import * as Actions from "../constants/actions";

const initialState: Order[] = [];

export default handleActions({
  [Actions.ADD_ORDERS]: (state, action) => {
    let orders = action.payload.map(data => _.assign(new Order(), data));
    return _.unionBy(orders, state, "id")
  }
}, initialState);
