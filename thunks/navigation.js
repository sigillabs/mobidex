import { Linking } from 'react-native';
import { setError } from '../actions';
import NavigationService from '../App/NavigationService';
import { getNetworkId, hasWalletOnFileSystem } from '../utils';

export function gotoEtherScan(txaddr) {
  return async (dispatch, getState) => {
    let {
      wallet: { web3 }
    } = getState();
    let networkId = await getNetworkId(web3);
    switch (networkId) {
      case 42:
        return await Linking.openURL(`https://kovan.etherscan.io/tx/${txaddr}`);

      default:
        return await Linking.openURL(`https://etherscan.io/txs/${txaddr}`);
    }
  };
}

export function gotoOnboardingOrLocked() {
  return async dispatch => {
    let hasWallet = await hasWalletOnFileSystem();
    if (hasWallet) {
      NavigationService.navigate('Locked');
    } else {
      NavigationService.navigate('Onboarding');
    }
  };
}

export function gotoTransactionScreen() {
  return async dispatch => {
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

