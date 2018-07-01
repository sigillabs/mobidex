import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import { View } from 'react-native';
import { Input, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
import { unlock } from '../../thunks';
import Button from '../components/Button';
import LongInput from '../components/LongInput';
import BigCenter from '../components/BigCenter';
import PinView from '../components/PinView';
import * as WalletService from '../services/WalletService';
import PinKeyboard from '../views/PinKeyboard';

@reactMixin.decorate(TimerMixin)
class UnlockWithPinScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pin: '',
      pinError: false
    };
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, marginHorizontal: 50 }}>
          <PinView
            value={this.state.pin}
            containerStyle={{
              flex: 4,
              alignItems: 'flex-end',
              marginBottom: 50
            }}
          />
          {this.state.pinError ? (
            <Text style={{ color: 'red', flex: 1 }}>
              Wrong or poorly formatted pin. Pins must be 6 characters long.
            </Text>
          ) : (
            <Text style={{ color: 'red', flex: 1 }}> </Text>
          )}
        </View>
        <PinKeyboard
          onChange={value => this.setPin(value)}
          onSubmit={() => this.unlock()}
        />
      </View>
    );
  }

  setPin(value) {
    let current = this.state.pin.slice();
    if (current.length > 6) {
      this.setState({ pin: '', pinError: false });
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
      this.setState({ pin: current, pinError: false });
    }
  }

  unlock() {
    if (this.state.pin.length < 6) {
      this.setState({ pinError: true });
      return;
    }

    this.requestAnimationFrame(async () => {
      try {
        await WalletService.unlock(this.state.pin.slice(0, 6));
      } catch (err) {
        this.setState({ pinError: true });
        return;
      }

      NavigationService.navigate('InitialLoad');
    });
  }
}

export default connect(state => ({}), dispatch => ({ dispatch }))(
  UnlockWithPinScreen
);
