import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
      tx: PropTypes.object,
      message: PropTypes.string,
      pin: PropTypes.string.isRequired,
      next: PropTypes.func.isRequired
    };
  }

  componentDidMount() {
    const { pin, tx, message } = this.props;
    requestAnimationFrame(async () => {
      try {
        if (tx) {
          const data = await WalletService.signTransaction(tx, pin.slice(0, 6));
          this.props.next(null, data);
        } else if (message) {
          const data = await WalletService.signMessage(
            message,
            pin.slice(0, 6)
          );
          this.props.next(null, data);
        }
      } catch (err) {
        this.props.next(err);
      } finally {
        this.props.navigation.dismissModal();
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

export default connectNavigation(Unlocking);
