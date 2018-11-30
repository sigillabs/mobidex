import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
// import NormalHeader from './App/headers/Normal';
// import OrdersHeader from './App/headers/Orders';
// import ProductsHeader from './App/headers/Products';
// import SendTokensHeader from './App/headers/SendTokens';
// import ProductDetailsHeader from './App/headers/ProductDetails';
import LogoTicker from './App/views/LogoTicker';
import { store } from './store';

export function registerHeaders() {
  Navigation.registerComponentWithRedux(
    'header.LogoTicker',
    () => LogoTicker,
    Provider,
    store
  );
}
