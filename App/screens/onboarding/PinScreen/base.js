import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect as connectNavigation } from '../../../../navigation';
import { navigationProp } from '../../../../types/props';
import MutedText from '../../../components/MutedText';
import PinKeyboard from '../../../components/PinKeyboard';
import PinView from '../../../components/PinView';

class BasePinScreen extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      mnemonic: PropTypes.arrayOf(PropTypes.string).isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      pin: ''
    };
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flex: 1, marginHorizontal: 50 }}>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'flex-end'
            }}
          >
            <MutedText>Provide a PIN to secure your wallet.</MutedText>
          </View>
          <PinView
            value={this.state.pin}
            containerStyle={{
              flex: 3,
              alignItems: 'flex-end',
              marginBottom: 50
            }}
          />
        </View>
        <PinKeyboard onChange={this.setPin} buttonTitle={'Import'} />
      </View>
    );
  }

  setPin = async value => {
    let current = this.state.pin.slice();
    if (current.length > 6) {
      this.setState({ pin: '' });
    } else {
      if (isNaN(value)) {
        if (value === 'back') {
          current = current.slice(0, -1);
        } else {
          current += value;
        }
      } else {
        current += value;
      }

      this.setState({ pin: current });

      if (current.length === 6) {
        this.state.pin = current;
        this.submit();
      }
    }
  };

  submit() {
    if (this.state.pin.length < 6) {
      return;
    }

    const mnemonic = this.props.mnemonic;
    const { pin } = this.state;

    this.props.navigation.showModal('modals.ConstructWallet', {
      mnemonic,
      pin,
      callback: error =>
        error
          ? this.props.navigation.showErrorModal(error)
          : this.props.navigation.push('navigation.trade.InitialLoadScreen')
    });
  }
}

export default connectNavigation(BasePinScreen);
