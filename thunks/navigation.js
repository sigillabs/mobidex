import { Linking } from 'react-native';
import { setError } from '../actions';
import NavigationService from '../services/NavigationService';
import * as WalletService from '../services/WalletService';
import EthereumClient from '../clients/ethereum';

export function gotoEtherScan(txaddr) {
  return async (dispatch, getState) => {
    const {
      wallet: { web3 }
    } = getState();
    const ethereumClient = new EthereumClient(web3);
    const networkId = await ethereumClient.getNetworkId();
    switch (networkId) {
      case 42:
        return await Linking.openURL(`https://kovan.etherscan.io/tx/${txaddr}`);

      default:
        return await Linking.openURL(`https://etherscan.io/tx/${txaddr}`);
    }
  };
}

export function gotoOnboardingOrLocked() {
  return async dispatch => {
    let hasWallet = await WalletService.isLocked();
    if (hasWallet) {
      NavigationService.navigate('Locked');
    } else {
      NavigationService.navigate('Onboarding');
    }
  };
}

export function gotoTransactionScreen() {
  return async () => {
    NavigationService.navigate('History');
  };
}

export function gotoErrorScreen(error) {
  return dispatch => {
    dispatch(setError(error));
    NavigationService.navigate('Error', { error });
  };
}

export function gotoSendScreen(token) {
  return () => {
    NavigationService.navigate('Send', { token });
  };
}

export function gotoReceiveScreen(token) {
  return () => {
    NavigationService.navigate('Receive', { token });
  };
}

export function gotoHistoryScreen() {
  return () => {
    NavigationService.navigate('History');
  };
}

export function gotoMyOrdersScreen() {
  return () => {
    NavigationService.navigate('Orders');
  };
}

export function gotoAccountsScreen() {
  return () => {
    NavigationService.navigate('Accounts');
  };
}

export function gotoUnlockScreen() {
  return () => {
    NavigationService.navigate('Unlock');
  };
}

export function gotoImportAccountScreen() {
  return () => {
    NavigationService.navigate('ImportAccount');
  };
}
