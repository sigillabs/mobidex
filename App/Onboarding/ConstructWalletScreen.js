import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationService from '../../services/NavigationService';
import * as WalletService from '../../services/WalletService';
import BigCenter from '../components/BigCenter';
import Padding from '../components/Padding';
import RotatingView from '../components/RotatingView';

export default class ConstructWalletScreen extends Component {
  static get propTypes() {
    return {
      navigation: PropTypes.shape({
        getParam: PropTypes.func.isRequired
      }).isRequired
    };
  }

  componentDidMount() {
    const mnemonic = this.props.navigation.getParam('mnemonic').join(' ');
    const pin = this.props.navigation.getParam('pin');
    requestAnimationFrame(async () => {
      await WalletService.importMnemonics(mnemonic, pin);
      NavigationService.navigate('Initial');
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
