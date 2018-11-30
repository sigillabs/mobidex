import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import SubmittingOrdersModal from './App/modals/SubmittingOrdersModal';
import ConstructWalletModal from './App/modals/ConstructWalletModal';
import ErrorModal from './App/modals/ErrorModal';
import LoadingModal from './App/modals/LoadingModal';
import PreviewOrderModal from './App/modals/PreviewOrderModal';
import UnlockAndSignModal from './App/modals/UnlockAndSignModal';
import { store } from './store';

export function registerModals() {
  Navigation.registerComponentWithRedux(
    'modals.Error',
    () => ErrorModal,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'modals.Loading',
    () => LoadingModal,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'modals.ConstructWallet',
    () => ConstructWalletModal,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'modals.SubmittingOrders',
    () => SubmittingOrdersModal,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'modals.PreviewOrder',
    () => PreviewOrderModal,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'modals.UnlockAndSign',
    () => UnlockAndSignModal,
    Provider,
    store
  );
}
