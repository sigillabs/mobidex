import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import InitialLoadScreen from '../App/screens/InitialLoadScreen';
import ProductScreen from '../App/screens/trade/ProductScreen';
import CreateOrderScreen from '../App/screens/trade/CreateOrderScreen';
import ProductDetailsScreen from '../App/screens/trade/ProductDetailsScreen';
import OrdersScreen from '../App/screens/orders/OrdersScreen';
import TransactionHistoryScreen from '../App/screens/orders/TransactionHistoryScreen';
import AccountsScreen from '../App/screens/wallet/AccountsScreen';
import ReceiveScreen from '../App/screens/wallet/ReceiveScreen';
import IntroScreen from '../App/screens/onboarding/IntroScreen';
import ImportMnemonicScreen from '../App/screens/onboarding/ImportMnemonicScreen';
import PreviewMnemonicScreen from '../App/screens/onboarding/PreviewMnemonicScreen';
import PinScreen from '../App/screens/onboarding/PinScreen';
import SettingsScreen from '../App/screens/SettingsScreen.js';
import { store } from '../store';

export function registerScreens() {
  Navigation.registerComponentWithRedux(
    'navigation.onboarding.Introduction',
    () => IntroScreen,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'navigation.onboarding.ImportMnemonic',
    () => ImportMnemonicScreen,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'navigation.onboarding.PreviewMnemonic',
    () => PreviewMnemonicScreen,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'navigation.onboarding.Pin',
    () => PinScreen,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'navigation.trade.InitialLoadScreen',
    () => InitialLoadScreen,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'navigation.trade.Products',
    () => ProductScreen,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'navigation.trade.ProductDetails',
    () => ProductDetailsScreen,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'navigation.trade.CreateOrder',
    () => CreateOrderScreen,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'navigation.orders.List',
    () => OrdersScreen,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'navigation.orders.TransactionHistory',
    () => TransactionHistoryScreen,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'navigation.wallet.Accounts',
    () => AccountsScreen,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'navigation.wallet.Receive',
    () => ReceiveScreen,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'navigation.Settings',
    () => SettingsScreen,
    Provider,
    store
  );
}
