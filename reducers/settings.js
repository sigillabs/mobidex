import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';

// const BASE_URL = 'https://api.radarrelay.com/0x/v0';
const BASE_URL = 'https://mobidex.io/relayer/v0';

const initialState = {
  network: 'kovan',
  // network: 'mainnet',
  relayerEndpoint: BASE_URL,
  forexCurrency: 'USD',
  quoteSymbol: 'WETH',
  showForexPrices: false
};

export default handleActions(
  {
    [Actions.TOGGLE_SHOW_FOREX]: state => {
      return { ...state, showForexPrices: !state.showForexPrices };
    },
    [Actions.SET_FOREX_CURRENCY]: (state, action) => {
      return { ...state, forexCurrency: action.payload };
    },
    [Actions.SET_NETWORK]: (state, action) => {
      return { ...state, network: action.payload };
    }
  },
  initialState
);
