import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import ActionModal from '../App/modals/ActionModal';
import ConfirmationModal from '../App/modals/ConfirmationModal';
import NotificationModal from '../App/modals/NotificationModal';
import ErrorModal from '../App/modals/ErrorModal';
import LoadingModal from '../App/modals/LoadingModal';
import PreviewOrderModal from '../App/modals/PreviewOrderModal';
import ReceiveModal from '../App/modals/ReceiveModal';
import SendModal from '../App/modals/SendModal';
import UnlockAndSignModal from '../App/modals/UnlockAndSignModal';
import WrapEtherModal from '../App/modals/WrapEtherModal';
import { store } from '../store';

export function registerModals() {
  Navigation.registerComponentWithRedux(
    'modals.Action',
    () => ActionModal,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'modals.Confirmation',
    () => ConfirmationModal,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'modals.Notification',
    () => NotificationModal,
    Provider,
    store
  );

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

  Navigation.registerComponentWithRedux(
    'modals.Receive',
    () => ReceiveModal,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'modals.Send',
    () => SendModal,
    Provider,
    store
  );

  Navigation.registerComponentWithRedux(
    'modals.WrapEther',
    () => WrapEtherModal,
    Provider,
    store
  );
}
