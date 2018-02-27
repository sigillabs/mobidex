import * as _ from "lodash";
import { handleActions } from "redux-actions";
import * as Actions from "../constants/actions";

export default handleActions({
  [Actions.FINISHED_LOADING_PRODUCTS]: (state, action) => {
    return {
      ...state,
      products: true
    }
  },
  [Actions.FINISHED_LOADING_WALLET]: (state, action) => {
    return {
      ...state,
      wallet: true
    }
  },
  [Actions.FINISHED_LOADING_ASSETS]: (state, action) => {
    return {
      ...state,
      assets: true
    }
  }
}, {
  wallet: false,
  products: false,
  assets: false
});
