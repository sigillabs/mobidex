import * as _ from "lodash";
import { handleActions } from "redux-actions";
import * as Actions from "../constants/actions";

// const BASE_URL = "https://api.radarrelay.com/0x/v0";
const BASE_URL = "http://localhost:8000/relayer/v0";

const initialState = {
  relayerEndpoint: BASE_URL,
};

export default handleActions({}, initialState);
