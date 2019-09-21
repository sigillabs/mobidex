import {Navigation} from 'react-native-navigation';
import {Provider} from 'react-redux';
import ProductScreen from '../App/screens/trade/ProductScreen';
import DetailsScreen from '../App/screens/trade/DetailsScreen';
import IntroScreen from '../App/screens/onboarding/IntroScreen';
import ImportMnemonicScreen from '../App/screens/onboarding/ImportMnemonicScreen';
import PreviewMnemonicScreen from '../App/screens/onboarding/PreviewMnemonicScreen';
import PinScreen from '../App/screens/onboarding/PinScreen';
import BitskiLogin from '../App/screens/onboarding/BitskiLogin';
import SettingsScreen from '../App/screens/SettingsScreen.js';
import OfflineScreen from '../App/screens/OfflineScreen.js';

export function registerScreens(store) {
  Navigation.registerComponentWithRedux(
    'navigation.onboarding.Introduction',
    () => IntroScreen,
    Provider,
    store,
  );

  Navigation.registerComponentWithRedux(
    'navigation.onboarding.ImportMnemonic',
    () => ImportMnemonicScreen,
    Provider,
    store,
  );

  Navigation.registerComponentWithRedux(
    'navigation.onboarding.PreviewMnemonic',
    () => PreviewMnemonicScreen,
    Provider,
    store,
  );

  Navigation.registerComponentWithRedux(
    'navigation.onboarding.Pin',
    () => PinScreen,
    Provider,
    store,
  );

  Navigation.registerComponentWithRedux(
    'navigation.onboarding.BitskiLogin',
    () => BitskiLogin,
    Provider,
    store,
  );

  Navigation.registerComponentWithRedux(
    'navigation.trade.Products',
    () => ProductScreen,
    Provider,
    store,
  );

  Navigation.registerComponentWithRedux(
    'navigation.trade.Details',
    () => DetailsScreen,
    Provider,
    store,
  );

  Navigation.registerComponentWithRedux(
    'navigation.Settings',
    () => SettingsScreen,
    Provider,
    store,
  );

  Navigation.registerComponentWithRedux(
    'navigation.Offline',
    () => OfflineScreen,
    Provider,
    store,
  );
}
