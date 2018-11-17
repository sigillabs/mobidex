import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
import { styles } from '../../styles';
import PinKeyboard from '../components/PinKeyboard';
import PinView from '../components/PinView';
import NavigationService from '../../services/NavigationService';

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
        <View
          style={[styles.bigCenter, { marginHorizontal: 50, marginBottom: 30 }]}
        >
          <PinView
            value={this.state.pin}
            containerStyle={{
              alignItems: 'flex-end',
              marginBottom: 20
            }}
          />
          {this.state.pinError ? (
            <Text style={[styles.top, { color: 'red' }]}>
              Pin incorrect. Try again.
            </Text>
          ) : (
            <Text style={[styles.top, { color: 'red' }]}> </Text>
          )}
        </View>
        <PinKeyboard onChange={this.setPin} />
      </View>
    );
  }

  setPin = value => {
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

      if (current.length === 6) {
        this.setState({ pin: current });
        this.unlock(current);
      }
    }
  };

  unlock(pin) {
    if (pin.length < 6) {
      this.setState({ pinError: true });
      return;
    }

    NavigationService.navigate('Unlocking', { pin: pin.slice(0, 6) });
  }
}

export default connect(() => ({}), dispatch => ({ dispatch }))(
  UnlockWithPinScreen
);
