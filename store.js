import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { saveStateMiddleware } from './lib/middleware/app';
import { getState } from './lib/stores/app';
import rootReducer from './reducers';

let STORE = null;

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
