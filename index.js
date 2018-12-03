import { EventEmitter } from 'events';
import 'node-libs-react-native/globals';
import { I18nManager, YellowBox } from 'react-native';
import { Navigation } from 'react-native-navigation';
import RNRestart from 'react-native-restart';
import { setInitialBootRoot, setOnboardingRoot } from './navigation';
import { registerHeaders } from './navigation/headers';
import { registerModals } from './navigation/modals';
import { registerScreens } from './navigation/screens';
import { store } from './store';
import { loadWalletAddress } from './thunks';
import { setExceptionHandlers } from './error-handlers';

if (I18nManager.isRTL) {
  I18nManager.allowRTL(false);
  RNRestart.Restart();
}

EventEmitter.defaultMaxListeners = 32000;

if (__DEV__) {
  YellowBox.ignoreWarnings([
    'Class RCTCxxModule',
    'Warning:',
    'Method',
    'Module',
    'MOBIDEX:'
  ]);
} else {
  setExceptionHandlers();
}

registerScreens();
registerHeaders();
registerModals();

Navigation.events().registerAppLaunchedListener(async () => {
  Navigation.setDefaultOptions({
    statusBar: {
      visible: true,
      style: 'dark'
    },
    topBar: {
      visible: false,
      drawBehind: true,
      animate: true
    }
  });

  await store.dispatch(loadWalletAddress());

  const {
    wallet: { address }
  } = store.getState();

  if (address) {
    setInitialBootRoot();
  } else {
    setOnboardingRoot();
  }
});
