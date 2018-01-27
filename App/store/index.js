import { createStore, applyMiddleware, Store } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";
import rootReducer from "../reducers";

export function configureStore(initialState) {
  let middleware = applyMiddleware(logger, thunk);

  if (process.env.NODE_ENV === "development") {
    middleware = composeWithDevTools(middleware);
  }

  return createStore(rootReducer, initialState, middleware);
}