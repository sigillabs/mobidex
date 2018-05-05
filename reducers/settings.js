import * as _ from 'lodash';
import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';

// const BASE_URL = 'https://api.radarrelay.com/0x/v0';
const BASE_URL = 'https://mobidex.io/relayer/v0';

const initialState = {
  network: 'kovan',
  relayerEndpoint: BASE_URL,
  forexCurrency: 'USD'
};

export default handleActions(
  {
    [Actions.SET_FOREX_CURRENCY]: (state, action) => {
      return { ...state, forexCurrency: action.payload };
    },
    [Actions.SET_NETWORK]: (state, action) => {
      return { ...state, network: action.payload };
    }
  },
  initialState
);
