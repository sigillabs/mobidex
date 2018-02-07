import * as _ from "lodash";
import { handleActions } from "redux-actions";
import * as Actions from "../constants/actions";

const initialState = [];

export default handleActions({
  [Actions.ADD_ERRORS]: (state, action) => {
    return _.unionBy(state, action.payload || [], "message");
  },
  [Actions.CLEAR_ERRORS]: (state, action) => {
    if (action.payload && action.payload.length) {
      return _.differenceBy(state, action.payload || [], "message");
    } else {
      return [];
    }
  }
}, initialState);
