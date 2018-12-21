import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { connect as connectNavigation } from '../../../navigation';
import * as WalletService from '../../../services/WalletService';
import { colors } from '../../../styles';
import { navigationProp } from '../../../types/props';
import BigCenter from '../../components/BigCenter';
import Padding from '../../components/Padding';
import RotatingView from '../../components/RotatingView';

class Unlocking extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      tx: PropTypes.object,
      message: PropTypes.string,
      pin: PropTypes.string.isRequired,
      next: PropTypes.func.isRequired
    };
  }

  componentDidMount() {
    const { pin, tx, message } = this.props;
    requestAnimationFrame(async () => {
      let data = null;

      try {
        if (tx) {
          data = await WalletService.signTransaction(
            tx,
            pin ? pin.slice(0, 6) : null
          );
        } else if (message) {
          data = await WalletService.signMessage(
            message,
            pin ? pin.slice(0, 6) : null
          );
        } else {
          throw new Error('No transaction or message provided to sign');
        }

        this.props.next(null, data);
      } catch (err) {
        this.props.next(err);
      } finally {
        this.props.navigation.dismissModal();
      }
    });
  }

  render() {
    if (this.props.pin) {
      return this.renderForPin();
    } else {
      return this.renderForTouchId();
    }
  }

  renderForPin() {
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

  renderForTouchId() {
    return (
      <BigCenter>
        <MaterialIcon name="fingerprint" color="green" size={100} />
        <Padding size={25} />
        <Text>Start scanning your fingerprint</Text>
      </BigCenter>
    );
  }
}

export default connectNavigation(Unlocking);
