import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { NavigationActions } from 'react-navigation';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import rootReducer from './reducers';

const navigationMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.navigation
);

const errorMiddleware = store => next => action => {
  if (action.type !== 'SET_ERROR') return next(action);

  store.dispatch(
    NavigationActions.push({
      routeName: 'Error',
      params: action.payload
    })
  );
};

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, navigationMiddleware)
  );
}
