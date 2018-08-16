import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import { InteractionManager, View } from 'react-native';
import { Input, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
import * as styles from '../../styles';
import { unlock } from '../../thunks';
import Button from '../components/Button';
import PinKeyboard from '../components/PinKeyboard';
import PinView from '../components/PinView';
import NavigationService from '../services/NavigationService';
import * as WalletService from '../services/WalletService';

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
          style={[styles.bigcenter, { marginHorizontal: 50, marginBottom: 30 }]}
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

      if (current.length === 6) {
        this.state.pin = current;
        this.unlock();
      }
    }
  }

  unlock() {
    if (this.state.pin.length < 6) {
      this.setState({ pinError: true });
      return;
    }

    InteractionManager.runAfterInteractions(async () => {
      try {
        await WalletService.unlock(this.state.pin.slice(0, 6));
      } catch (err) {
        this.setState({ pinError: true });
        return;
      }

      this.setState({ pinError: false });
      NavigationService.navigate('Products');
    });
  }
}

export default connect(state => ({}), dispatch => ({ dispatch }))(
  UnlockWithPinScreen
);
