import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import { Text } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect as connectNavigation } from '../../../navigation';
import * as WalletService from '../../../services/WalletService';
import BigCenter from '../../components/BigCenter';
import Padding from '../../components/Padding';
import RotatingView from '../../components/RotatingView';

class BaseConstructWalletScreen extends Component {
  static get propTypes() {
    return {
      mnemonic: PropTypes.arrayOf(PropTypes.string).isRequired,
      pin: PropTypes.string.isRequired
    };
  }

  componentDidMount() {
    const mnemonic = this.props.mnemonic.join(' ');
    const pin = this.props.pin;
    InteractionManager.runAfterInteractions(async () => {
      await WalletService.importMnemonics(mnemonic, pin);
      this.props.navigation.dismissModal();
      this.props.navigation.push('navigation.trade.InitialLoadScreen');
    });
  }

  render() {
    return (
      <BigCenter>
        <RotatingView>
          <FontAwesome name="gear" size={100} />
        </RotatingView>
        <Padding size={25} />
        <Text>Constructing Wallet...</Text>
      </BigCenter>
    );
  }
}

export default connectNavigation(BaseConstructWalletScreen);
