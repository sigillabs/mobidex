import {Navigation} from 'react-native-navigation';
import {Provider} from 'react-redux';
import ActionModal from '../App/modals/ActionModal';
import ConfirmationModal from '../App/modals/ConfirmationModal';
import NotificationModal from '../App/modals/NotificationModal';
import ErrorModal from '../App/modals/ErrorModal';
import LoadingModal from '../App/modals/LoadingModal';
import ReceiveModal from '../App/modals/ReceiveModal';
import SelectModal from '../App/modals/SelectModal';
import SendModal from '../App/modals/SendModal';
import UnlockAndSignModal from '../App/modals/UnlockAndSignModal';

export function registerModals(store) {
  Navigation.registerComponentWithRedux(
    'modals.Action',
    () => ActionModal,
    Provider,
    store,
  );

  Navigation.registerComponentWithRedux(
    'modals.Confirmation',
    () => ConfirmationModal,
    Provider,
    store,
  );

  Navigation.registerComponentWithRedux(
    'modals.Notification',
    () => NotificationModal,
    Provider,
    store,
  );

  Navigation.registerComponentWithRedux(
    'modals.Select',
    () => SelectModal,
    Provider,
    store,
  );

  Navigation.registerComponentWithRedux(
    'modals.Error',
    () => ErrorModal,
    Provider,
    store,
  );

  Navigation.registerComponentWithRedux(
    'modals.Loading',
    () => LoadingModal,
    Provider,
    store,
  );

  Navigation.registerComponentWithRedux(
    'modals.UnlockAndSign',
    () => UnlockAndSignModal,
    Provider,
    store,
  );

  Navigation.registerComponentWithRedux(
    'modals.Receive',
    () => ReceiveModal,
    Provider,
    store,
  );

  Navigation.registerComponentWithRedux(
    'modals.Send',
    () => SendModal,
    Provider,
    store,
  );
}
