// Stolen from https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html

import { NavigationActions } from 'react-navigation';
import { setError } from '../actions';

let _navigator;
let _store;

export function setStore(store) {
  _store = store;
}

export function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

export function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}

export function goBack() {
  _navigator.dispatch(NavigationActions.back());
}

export function error(error) {
  console.warn(error);
  _store.dispatch(setError(error));
  navigate('Error', { error });
}

export default {
  error,
  goBack,
  navigate,
  setTopLevelNavigator
};
