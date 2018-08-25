import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';

const BASE_URL = 'https://mobidex.io/relayer/v0';

const initialState = {
  network: 'mainnet',
  relayerEndpoint: BASE_URL,
  forexCurrency: 'USD',
  quoteSymbol: 'WETH',
  showForexPrices: false,
  // gasPrice: '3000000000',
  gasPrice: '4000000000',
  maxGas: '520000'
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
