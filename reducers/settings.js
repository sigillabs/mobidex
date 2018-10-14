import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';

const initialState = {
  network: 1,
  ethereumNodeEndpoint: 'http://mobidex.io:8545',
  // ethereumNodeEndpoint: 'https://mainnet.infura.io/',
  // ethereumNodeEndpoint: 'http://mobidex.io:9545',
  // ethereumNodeEndpoint: 'https://kovan.infura.io/',
  relayerEndpoint: 'https://mobidex.io:8443/relayer/v2',
  // relayerEndpoint: 'https://mobidex.io:9443/relayer/v2',
  inf0xEndpoint: 'https://mobidex.io:8443/inf0x',
  // inf0xEndpoint: 'https://mobidex.io:9443/inf0x',
  forexCurrency: 'USD',
  quoteSymbol: 'WETH',
  showForexPrices: false,
  gasPrice: 3000000000,
  gasLimit: 620000,
  minimumBalance: 10 ** 16
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
