import * as _ from "lodash";
import { handleActions } from "redux-actions";
import * as Actions from "../constants/actions";

export default handleActions({
  [Actions.SET_TOKENS]: (state, action) => {
    return action.payload;
  }
}, []);
