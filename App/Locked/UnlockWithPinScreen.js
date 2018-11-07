import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import { InteractionManager, View } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
import * as styles from '../../styles';
import PinKeyboard from '../components/PinKeyboard';
import PinView from '../components/PinView';
import NavigationService from '../../services/NavigationService';
import * as WalletService from '../../services/WalletService';
import UnlockingScreen from './Unlocking';

@reactMixin.decorate(TimerMixin)
class UnlockWithPinScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pin: '',
      pinError: false,
      showUnlocking: false
    };
  }

  render() {
    if (this.state.showUnlocking) {
      return <UnlockingScreen />;
    }

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
          onSubmit={() => {}}
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
        this.setState({ pin: current });
        this.unlock(current);
      }
    }
  }

  unlock(pin) {
    if (pin.length < 6) {
      this.setState({ pinError: true });
      return;
    }

    this.setState({ showUnlocking: true });

    InteractionManager.runAfterInteractions(async () => {
      try {
        await WalletService.unlock(pin.slice(0, 6));
      } catch (err) {
        this.setState({ pinError: true });
        return;
      } finally {
        this.setState({ showUnlocking: false });
      }

      this.setState({ pinError: false });
      NavigationService.navigate('Initial');
    });
  }
}

export default connect(state => ({}), dispatch => ({ dispatch }))(
  UnlockWithPinScreen
);
