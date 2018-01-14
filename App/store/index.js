import { createStore, applyMiddleware, Store } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { logger } from "../middleware";
import rootReducer from "../reducers";

export function configureStore(initialState) {
  let middleware = applyMiddleware(logger, thunk);

  if (process.env.NODE_ENV === "development") {
    middleware = composeWithDevTools(middleware);
  }

  const store = createStore(rootReducer, initialState, middleware);

  if (module.hot) {
    module.hot.accept("../reducers", () => {
      const nextReducer = require("../reducers");
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}