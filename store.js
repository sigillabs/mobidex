import { createStore, applyMiddleware, Store } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { createReactNavigationReduxMiddleware } from "react-navigation-redux-helpers";
import rootReducer from "./reducers";

const navigationMiddleware = createReactNavigationReduxMiddleware("root", state => state.navigation);
export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, applyMiddleware(thunk, logger, navigationMiddleware));
}
