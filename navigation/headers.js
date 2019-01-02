import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import LogoBalance from '../App/views/LogoBalance';
import LogoProductBalance from '../App/views/LogoProductBalance';
import LogoTicker from '../App/views/LogoTicker';
import { store } from '../store';

export function registerHeaders() {
  Navigation.registerComponentWithRedux(
    'header.LogoTicker',
    () => LogoTicker,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'header.LogoBalance',
    () => LogoBalance,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'header.LogoProductBalance',
    () => LogoProductBalance,
    Provider,
    store
  );
}
