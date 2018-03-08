import * as _ from "lodash";
import { handleActions } from "redux-actions";
import * as Actions from "../constants/actions";

// const BASE_URL = "https://api.radarrelay.com/0x/v0";
const BASE_URL = "http://mobidex.io:8000/relayer/v0";

const initialState = {
  network: "kovan",
  relayerEndpoint: BASE_URL,
  quoteToken: null,
  baseToken: null
};

export default handleActions({
  [Actions.SET_BASE_TOKEN]: (state, action) => {
    return { ...state, baseToken: action.payload };
  },
  [Actions.SET_QUOTE_TOKEN]: (state, action) => {
    return { ...state, quoteToken: action.payload };
  },
  [Actions.SET_NETWORK]: (state, action) => {
    return { ...state, network: action.payload };
  }
}, initialState);
