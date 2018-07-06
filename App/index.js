import React, { Component } from 'react';
// import { Alert } from 'react-native';
// import BackgroundTask from 'react-native-background-task';
import { Provider } from 'react-redux';
import configureStore from '../store';
import Bootstrap from './Bootstrap';
import { setStore as setStoreForNavigationService } from './services/NavigationService';
import { setStore as setStoreForOrderService } from './services/OrderService';
import { setStore as setStoreForProductService } from './services/ProductService';
import { setStore as setStoreForTickerService } from './services/TickerService';
import { setStore as setStoreForTokenService } from './services/TokenService';
import { setStore as setStoreForWalletService } from './services/WalletService';

const store = configureStore();

setStoreForNavigationService(store);
setStoreForOrderService(store);
setStoreForProductService(store);
setStoreForTickerService(store);
setStoreForTokenService(store);
setStoreForWalletService(store);

// BackgroundTask.define(() => {
//   console.log('Hello from a background task');
//   BackgroundTask.finish();
// });

export default class App extends Component {
  // componentDidMount() {
  //   BackgroundTask.schedule({
  //     period: 900 // Aim to run every 1 second
  //   });

  //   // Optional: Check if the device is blocking background tasks or not
  //   this.checkStatus();
  // }

  // async checkStatus() {
  //   const status = await BackgroundTask.statusAsync();

  //   if (status.available) {
  //     return;
  //   }

  //   const reason = status.unavailableReason;
  //   if (reason === BackgroundTask.UNAVAILABLE_DENIED) {
  //     Alert.alert(
  //       'Denied',
  //       'Please enable background "Background App Refresh" for this app'
  //     );
  //   } else if (reason === BackgroundTask.UNAVAILABLE_RESTRICTED) {
  //     Alert.alert(
  //       'Restricted',
  //       'Background tasks are restricted on your device'
  //     );
  //   }
  // }

  render() {
    return (
      <Provider store={store}>
        <Bootstrap />
      </Provider>
    );
  }
}
