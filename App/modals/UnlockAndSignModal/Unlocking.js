import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { connect as connectNavigation } from '../../../navigation';
import { WalletService } from '../../../services/WalletService';
import { colors } from '../../../styles';
import { navigationProp } from '../../../types/props';
import BigCenter from '../../components/BigCenter';
import VerticalPadding from '../../components/VerticalPadding';
import RotatingView from '../../components/RotatingView';

class Unlocking extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      tx: PropTypes.object,
      message: PropTypes.string,
      next: PropTypes.func.isRequired,
      pin: PropTypes.string,
      isFaceID: PropTypes.bool
    };
  }

  componentDidMount() {
    const { pin, tx, message } = this.props;
    requestAnimationFrame(async () => {
      let data = null;

      try {
        if (tx) {
          data = await WalletService.instance.signTransaction(
            tx,
            pin ? pin.slice(0, 6) : null
          );
        } else if (message) {
          data = await WalletService.instance.signMessage(
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
    } else if (this.props.isFaceID) {
      return this.renderForFaceId();
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
        <VerticalPadding size={25} />
        <Text>Unlocking Mobidex...</Text>
      </BigCenter>
    );
  }

  renderForTouchId() {
    return (
      <BigCenter>
        <MaterialIcon name="fingerprint" color="green" size={100} />
        <VerticalPadding size={25} />
        <Text>Start scanning your fingerprint</Text>
      </BigCenter>
    );
  }

  renderForFaceId() {
    return (
      <BigCenter>
        <MaterialIcon name="face" color="green" size={100} />
        <VerticalPadding size={25} />
        <Text>Start scanning your face</Text>
      </BigCenter>
    );
  }
}

export default connectNavigation(Unlocking);
