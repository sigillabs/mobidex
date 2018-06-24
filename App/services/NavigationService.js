// Stolen from https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html

import { NavigationActions } from 'react-navigation';

let _navigator;

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

export default {
  navigate,
  goBack,
  setTopLevelNavigator
};
