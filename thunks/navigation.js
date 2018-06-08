import { Linking } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { setError } from '../actions';
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
      dispatch(NavigationActions.navigate({ routeName: 'Locked' }));
    } else {
      dispatch(NavigationActions.navigate({ routeName: 'Onboarding' }));
    }
  };
}

export function gotoTransactionScreen() {
  return async dispatch => {
    dispatch(NavigationActions.navigate({ routeName: 'History' }));
  };
}

export function gotoErrorScreen(error) {
  return dispatch => {
    dispatch(setError(error));
    dispatch(
      NavigationActions.navigate({ routeName: 'Error', params: { error } })
    );
  };
}
