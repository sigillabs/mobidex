import * as _ from "lodash";
import { handleActions } from "redux-actions";
import * as Actions from "../constants/actions";

export default handleActions({
  [Actions.SET_BALANCE]: (state, action) => {
    return {
      ...state,
      [ action.payload.address ]: action.payload.balance
    }
  }
}, {});
