import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import LogoBalance from '../App/views/LogoBalance';
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
}
