import { AsyncStorage } from 'react-native';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

let STORE = null;
const KEY = 'app-state';

async function getState() {
  const json = await AsyncStorage.getItem(KEY);
  if (!json) {
    return undefined;
  }
  return JSON.parse(json);
}

export async function clearState() {
  return AsyncStorage.removeItem(KEY);
}

const saveStateMiddleware = store => next => action => {
  try {
    return next(action);
  } finally {
    let state = store.getState();

    // 1. Make a copy of the state
    state = { ...state };
    state.relayer = { ...state.relayer };

    // 2. Skip orderbook
    state.relayer.orderbooks = {};

    // 3. Skip orders
    state.relayer.orders = [];

    AsyncStorage.setItem(KEY, JSON.stringify(state));
  }
};

export async function initialize(next) {
  const initialState = await getState();
  STORE = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, saveStateMiddleware)
  );
  next(STORE);
}

export function get() {
  return STORE;
}
