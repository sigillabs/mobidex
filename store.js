import {BigNumber} from '@uniswap/sdk';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {saveStateMiddleware} from './lib/middleware/app';
import {getState} from './lib/stores/app';
import rootReducer from './reducers';

let STORE = null;

const BIG_NUMBER_FIELDS = ['gasPrice', 'gasLimit'];

function convertBigNumbers(value, key) {
  if (typeof value === 'object') {
    for (const key in value) {
      value[key] = convertBigNumbers(value[key], key);
    }
    return value;
  } else if (typeof value === 'array') {
    return value.map(v => convertBigNumbers(v, key));
  } else {
    if (~BIG_NUMBER_FIELDS.indexOf(key)) {
      return new BigNumber(value);
    } else {
      return value;
    }
  }
}

export async function initialize(next) {
  const initialState = await getState(convertBigNumbers);
  STORE = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, saveStateMiddleware),
  );
  next(STORE);
}

export function get() {
  return STORE;
}
