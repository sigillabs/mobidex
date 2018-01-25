import * as _ from "lodash";
import { Dimensions } from "react-native";
import { handleActions } from "redux-actions";
import * as Actions from "../constants/actions";

const initialState = {
  loading: false
};

export default handleActions({
  [Actions.START_LOADING]: (state, action) => {
    state.loading = true;
    return state;
  },
  [Actions.STOP_LOADING]: (state, action) => {
    state.loading = false;
    return state;
  }
}, initialState);
