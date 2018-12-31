import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { setStore as setStoreForAssetService } from './services/AssetService';
import { setStore as setStoreForOrderService } from './services/OrderService';
import { setStore as setStoreForTickerService } from './services/TickerService';
import TimerService from './services/TimerService';
import {
  ActiveTransactionWatchdog,
  TransactionService
} from './services/TransactionService';
import { setStore as setStoreForWalletService } from './services/WalletService';

const store = createStore(rootReducer, undefined, applyMiddleware(thunk));

TimerService.getInstance(60 * 1000).start();

setStoreForAssetService(store);
setStoreForOrderService(store);
setStoreForTickerService(store);
setStoreForWalletService(store);

new TransactionService(store);
new ActiveTransactionWatchdog(store).start();

export { store };
