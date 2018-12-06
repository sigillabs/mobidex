import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect as connectNavigation } from '../../../navigation';
import * as WalletService from '../../../services/WalletService';
import { navigationProp } from '../../../types/props';
import BigCenter from '../../components/BigCenter';
import Padding from '../../components/Padding';
import RotatingView from '../../components/RotatingView';

class BaseConstructWalletScreen extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      mnemonic: PropTypes.arrayOf(PropTypes.string).isRequired,
      pin: PropTypes.string.isRequired,
      callback: PropTypes.func.isRequired
    };
  }

  componentDidMount() {
    const mnemonic = this.props.mnemonic.join(' ');
    const pin = this.props.pin;
    requestAnimationFrame(async () => {
      try {
        await WalletService.importMnemonics(mnemonic, pin);
      } catch (err) {
        this.props.navigation.dismissModal();
        this.props.callback(err);
        return;
      }

      this.props.navigation.dismissModal();
      this.props.callback();
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
