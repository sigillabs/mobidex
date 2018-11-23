import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '../store';
import Bootstrap from './Bootstrap';
import PageRoot from './components/PageRoot';
import { setStore as setStoreForAssetService } from '../services/AssetService';
import { setStore as setStoreForNavigationService } from '../services/NavigationService';
import { setStore as setStoreForOrderService } from '../services/OrderService';
import { setStore as setStoreForProductService } from '../services/ProductService';
import { setStore as setStoreForTickerService } from '../services/TickerService';
import TimerService from '../services/TimerService';
import {
  ActiveTransactionWatchdog,
  TransactionService
} from '../services/TransactionService';
import { setStore as setStoreForWalletService } from '../services/WalletService';
import { setStore as setStoreForZeroExService } from '../services/ZeroExService';

const store = configureStore();

TimerService.getInstance(1000).start();

setStoreForAssetService(store);
setStoreForNavigationService(store);
setStoreForOrderService(store);
setStoreForProductService(store);
setStoreForTickerService(store);
setStoreForWalletService(store);
setStoreForZeroExService(store);

new TransactionService(store);
new ActiveTransactionWatchdog(store).start();

export default class App extends Component {
  render() {
    return (
      <PageRoot forceInset={{ bottom: 'never', top: 'never' }}>
        <Provider store={store}>
          <Bootstrap />
        </Provider>
      </PageRoot>
    );
  }
}
