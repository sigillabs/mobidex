import * as _ from "lodash";
import { handleActions } from "redux-actions";
import * as Actions from "../constants/actions";

// const BASE_URL = "https://api.radarrelay.com/0x/v0";
const BASE_URL = "http://localhost:8000/relayer/v0";

const initialState = {
  quoteToken: null,
  baseToken: null,
  relayerEndpoint: BASE_URL
};

export default handleActions({
  [Actions.SET_QUOTE_TOKEN]: (state, action) => {
    return {
      ...state,
      quoteToken: action.payload
    };
  },
  [Actions.SET_BASE_TOKEN]: (state, action) => {
    return {
      ...state,
      baseToken: action.payload
    };
  }
}, initialState);
