import * as _ from "lodash";
import { handleActions } from "redux-actions";
import * as Actions from "../constants/actions";

export default handleActions({
  [Actions.FINISHED_LOADING_TOKENS]: (state, action) => {
    return {
      ...state,
      tokens: true
    }
  },
  [Actions.FINISHED_LOADING_WALLET]: (state, action) => {
    return {
      ...state,
      wallet: true
    }
  }
}, {
  wallet: false,
  tokens: false
});
