import {BigNumber} from '@uniswap/sdk';
import {handleActions} from 'redux-actions';
import * as Actions from '../constants/actions';
import {ZERO} from '../constants';

const PROD = {
  network: 1,
  // ethereumNodeEndpoint:
  //   'https://mainnet.infura.io/v3/9c07eacbc58e42fa9a5b5b19d8992787',
  ethereumNodeEndpoint:
    'https://eth-mainnet.alchemyapi.io/jsonrpc/x1YomDJDRqqvIAHJNeEhpGoZj6i18ARB',
  uniswap: {
    factoryAddress: '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95',
  },
  weth9: {
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
};

const STAGE = {
  network: 4,
  // ethereumNodeEndpoint:
  //   'https://rinkby.infura.io/v3/9c07eacbc58e42fa9a5b5b19d8992787',
  ethereumNodeEndpoint:
    'https://eth-rinkby.alchemyapi.io/jsonrpc/luC74yyUWG5lXOj1yMaAIo8Ik5ZLqsti',
  uniswap: {
    factoryAddress: '0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36',
  },
  weth9: {
    address: '0x1b45d86492d098b10fdbf382c537359f776f8dad',
  },
};

const initialState = {
  firstLoad: true,
  // ...(__DEV__ ? STAGE : PROD),
  // ...STAGE,
  ...PROD,
  forexCurrency: 'USD',
  quoteSymbol: 'ETH',
  feeSymbol: 'ZRX',
  networkFeeSymbol: 'ETH',
  showForexPrices: false,
  gasStation: 'default',
  gasLevel: 'low',
  gasPrice: ZERO,
  gasLimit: ZERO,
  minimumBalance: 10 ** 16,
  bitski: {
    auth: {
      issuer: 'https://account.bitski.com/',
      clientId: '5b9d3c1a-0b08-4e02-971e-ad65e37cdcd5',
      redirectUrl: 'mobidex://auth',
      scopes: ['openid', 'offline'],
    },
    endpoint: 'https://api.bitski.com/v1/transactions',
  },
};

export default handleActions(
  {
    [Actions.FINISHED_FIRST_LOAD]: state => {
      return {...state, firstLoad: false};
    },
    [Actions.TOGGLE_SHOW_FOREX]: state => {
      return {...state, showForexPrices: !state.showForexPrices};
    },
    [Actions.SET_FOREX_CURRENCY]: (state, action) => {
      return {...state, forexCurrency: action.payload};
    },
    [Actions.SET_NETWORK]: (state, action) => {
      return {...state, network: action.payload};
    },
    [Actions.SET_GAS_PRICE]: (state, action) => {
      return {...state, gasPrice: new BigNumber(action.payload)};
    },
    [Actions.SET_GAS_LIMIT]: (state, action) => {
      return {...state, gasLimit: new BigNumber(action.payload)};
    },
    [Actions.SET_GAS_STATION]: (state, action) => {
      return {...state, gasStation: action.payload};
    },
    [Actions.SET_GAS_LEVEL]: (state, action) => {
      return {...state, gasLevel: action.payload};
    },
  },
  initialState,
);
