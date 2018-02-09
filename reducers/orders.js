import * as _ from "lodash";
import { handleActions } from "redux-actions";
import * as Actions from "../constants/actions";

export default handleActions({
  [Actions.ADD_ORDERS]: (state, action) => {
    return _.unionBy(state, action.payload, "orderHash");
  }
}, []);
