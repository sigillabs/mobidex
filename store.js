import { AsyncStorage } from 'react-native';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { fixOrders } from './lib/utils/orders';
import Orderbook from './lib/orderbook';
import rootReducer from './reducers';

let STORE = null;
const KEY = 'app-state';

async function getState() {
  const json = await AsyncStorage.getItem(KEY);
  if (!json) {
    return undefined;
  }
  const object = JSON.parse(json);

  // 1. Change orderbook to rbtree
  const orderbooks = {};
  for (const baseAssetData in object.relayer.orderbooks) {
    if (!orderbooks[baseAssetData]) {
      orderbooks[baseAssetData] = {};
    }
    for (const quoteAssetData of object.relayer.orderbooks[baseAssetData]) {
      const bids = fixOrders(
        object.relayer.orderbooks[baseAssetData][quoteAssetData].bids
      );
      const asks = fixOrders(
        object.relayer.orderbooks[baseAssetData][quoteAssetData].asks
      );
      orderbooks[baseAssetData][quoteAssetData] = new Orderbook();
      for (const bid of fixOrders(bids)) {
        orderbooks[baseAssetData][quoteAssetData].add(bid);
      }
      for (const ask of fixOrders(asks)) {
        orderbooks[baseAssetData][quoteAssetData].add(ask);
      }
    }
  }

  object.relayer.orderbooks = orderbooks;

  // 2. Change orders to serializable
  object.relayer.orders = fixOrders(object.relayer.orders);

  return object;
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

    // 2. Change orderbook to serializable
    const serializableOrderbooks = {};
    for (const baseAssetData in state.relayer.orderbooks) {
      if (!serializableOrderbooks[baseAssetData]) {
        serializableOrderbooks[baseAssetData] = {};
      }
      for (const quoteAssetData in state.relayer.orderbooks[baseAssetData]) {
        serializableOrderbooks[baseAssetData][
          quoteAssetData
        ] = state.relayer.orderbooks[baseAssetData][
          quoteAssetData
        ].serializable();
      }
    }
    state.relayer.orderbooks = {};

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
