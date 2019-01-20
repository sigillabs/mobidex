import { BigNumber } from '0x.js';
import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';
import { ZERO } from '../constants/0x';

const PROD = {
  network: 1,
  ethereumNodeEndpoint:
    'https://mainnet.infura.io/v3/9c07eacbc58e42fa9a5b5b19d8992787',
  // ethereumNodeEndpoint:
  //   'https://eth-mainnet.alchemyapi.io/jsonrpc/x1YomDJDRqqvIAHJNeEhpGoZj6i18ARB',
  relayerEndpoint: 'https://mobidex.io/relayer/v2',
  relayerWSS: 'wss://mobidex.io/relayer/v2/',
  inf0xEndpoint: 'https://mobidex.io:9443/inf0x/2.1/',
  inf0xWSS: 'wss://mobidex.io:9443/inf0x/2.1/'
};

const STAGE = {
  network: 42,
  // ethereumNodeEndpoint:
  //   'https://kovan.infura.io/v3/9c07eacbc58e42fa9a5b5b19d8992787',
  ethereumNodeEndpoint:
    'https://eth-kovan.alchemyapi.io/jsonrpc/x1YomDJDRqqvIAHJNeEhpGoZj6i18ARB',
  relayerEndpoint: 'https://mobidex.io:9443/relayer/v2',
  relayerWSS: 'wss://mobidex.io:9443/relayer/v2/',
  inf0xEndpoint: 'https://mobidex.io:9443/inf0x/2.0/',
  inf0xWSS: 'wss://mobidex.io:9443/inf0x/2.0/'
};

const DEV = {
  network: 50,
  ethereumNodeEndpoint: 'http://localhost:8545',
  relayerEndpoint: 'https://mobidex.io:9443/relayer/v2',
  relayerWSS: 'wss://mobidex.io:9443/relayer/v2/',
  inf0xEndpoint: 'https://mobidex.io:9443/inf0x/2.0/',
  inf0xWSS: 'wss://mobidex.io:9443/inf0x/2.0/'
};

const initialState = {
  ...PROD,
  // ...STAGE,
  // ...DEV,
  forexCurrency: 'USD',
  quoteSymbol: 'WETH',
  feeSymbol: 'ZRX',
  networkFeeSymbol: 'ETH',
  showForexPrices: false,
  gasPrice: ZERO,
  gasLimit: ZERO,
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
    },
    [Actions.SET_GAS_PRICE]: (state, action) => {
      return { ...state, gasPrice: new BigNumber(action.payload) };
    },
    [Actions.SET_GAS_LIMIT]: (state, action) => {
      return { ...state, gasLimit: new BigNumber(action.payload) };
    }
  },
  initialState
);
