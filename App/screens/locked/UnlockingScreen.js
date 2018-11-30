import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import { Text } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { push } from '../../../navigation';
import * as WalletService from '../../../services/WalletService';
import { colors } from '../../../styles';
import BigCenter from '../../components/BigCenter';
import Padding from '../../components/Padding';
import RotatingView from '../../components/RotatingView';

export default class UnlockingScreen extends Component {
  static get propTypes() {
    return {
      pin: PropTypes.string.isRequired
    };
  }

  componentDidMount() {
    const pin = this.props.pin;
    InteractionManager.runAfterInteractions(async () => {
      try {
        await WalletService.unlock(pin.slice(0, 6));
        push('navigation.tradeInitial');
      } catch (err) {
        push('navigation.tradeChooseUnlockMethod', { error: true });
      }
    });
  }

  render() {
    return (
      <BigCenter>
        <RotatingView>
          <FontAwesome name="unlock" color={colors.yellow0} size={100} />
        </RotatingView>
        <Padding size={25} />
        <Text>Unlocking Mobidex...</Text>
      </BigCenter>
    );
  }
}
