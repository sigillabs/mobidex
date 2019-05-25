import PropTypes from 'prop-types';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import RNRestart from 'react-native-restart';
import {
  checkOrRequestExternalStorageWrite,
  connect as connectNavigation
} from '../../../../navigation';
import { styles } from '../../../../styles';
import { WalletService } from '../../../../services/WalletService';
import { ActionErrorSuccessFlow } from '../../../../thunks';
import { navigationProp } from '../../../../types/props';
import MutedText from '../../../components/MutedText';
import VerticalPadding from '../../../components/VerticalPadding';
import PinKeyboardLayout from '../../../layouts/PinKeyboardLayout';

class BasePinScreen extends PinKeyboardLayout {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      mnemonic: PropTypes.arrayOf(PropTypes.string).isRequired,
      dispatch: PropTypes.func.isRequired
    };
  }

  renderTop() {
    return (
      <React.Fragment>
        <VerticalPadding size={50} />
        <MutedText style={[styles.textCenter]}>
          Provide a PIN to secure your wallet.
        </MutedText>
      </React.Fragment>
    );
  }

  renderBottom() {
    return null;
  }

  getKeyboardProps() {
    return {};
  }

  finish(pin) {
    const mnemonic = this.props.mnemonic.join(' ');

    this.props.dispatch(
      ActionErrorSuccessFlow(
        this.props.navigation.componentId,
        {
          action: async () => {
            await checkOrRequestExternalStorageWrite();
            await WalletService.instance.importMnemonics(
              mnemonic,
              pin.join('')
            );
          },
          icon: <FontAwesome name="gear" size={100} />,
          label: 'Constructing Wallet...'
        },
        'Wallet secured',
        () => RNRestart.Restart()
      )
    );
  }
}

export default connect(
  () => ({}),
  dispatch => ({ dispatch })
)(connectNavigation(BasePinScreen));
