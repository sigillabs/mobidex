import { EventEmitter } from 'events';
import 'node-libs-react-native/globals';
import { I18nManager, YellowBox } from 'react-native';
import { Navigation } from 'react-native-navigation';
import RNRestart from 'react-native-restart';
import { setInitialBootRoot, setOnboardingRoot } from './navigation';
import { registerHeaders } from './navigation/headers';
import { registerModals } from './navigation/modals';
import { registerScreens } from './navigation/screens';
import { setStore as setStoreForAssetService } from './services/AssetService';
import { setStore as setStoreForOrderService } from './services/OrderService';
import { setStore as setStoreForTickerService } from './services/TickerService';
import TimerService from './services/TimerService';
import {
  ActiveTransactionWatchdog,
  TransactionService
} from './services/TransactionService';
import { setStore as setStoreForWalletService } from './services/WalletService';
import { initialize as initializeStore } from './store';
import { loadWalletAddress } from './thunks';
import { setExceptionHandlers } from './error-handlers';

// if (I18nManager.isRTL) {
//   I18nManager.allowRTL(false);
//   RNRestart.Restart();
// }
I18nManager.forceRTL(true);

EventEmitter.defaultMaxListeners = 32000;

if (__DEV__) {
  YellowBox.ignoreWarnings([
    'Setting a timer',
    'Class RCTCxxModule',
    'Warning:',
    'Method',
    'Module',
    'MOBIDEX:'
  ]);
} else {
  setExceptionHandlers();
}

const initializeApp = (function initialize() {
  let _store = null;
  let _count = 0;

  return async store => {
    if (store) _store = store;
    if (++_count < 2) return;

    TimerService.getInstance(60 * 1000).start();
    setStoreForAssetService(_store);
    setStoreForOrderService(_store);
    setStoreForTickerService(_store);
    setStoreForWalletService(_store);
    new TransactionService(_store);
    new ActiveTransactionWatchdog(_store).start();

    await _store.dispatch(loadWalletAddress());

    const {
      wallet: { address }
    } = _store.getState();

    registerScreens(_store);
    registerHeaders(_store);
    registerModals(_store);

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

    if (address) {
      setInitialBootRoot();
    } else {
      setOnboardingRoot();
    }
  };
})();

initializeStore(initializeApp);
Navigation.events().registerAppLaunchedListener(initializeApp);
