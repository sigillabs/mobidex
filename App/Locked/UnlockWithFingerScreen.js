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
import PinView from '../components/PinView';
import * as WalletService from '../services/WalletService';
import NavigationService from '../services/NavigationService';
import PinKeyboard from '../views/PinKeyboard';

@reactMixin.decorate(TimerMixin)
class UnlockWithFingerScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false
    };
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Button large onPress={() => this.unlock()} title="Unlock" />
        {this.state.error ? this.renderError() : null}
        <Button
          large
          onPress={() => NavigationService.navigate('UnlockWithPin')}
          title="Try pin"
        />
      </View>
    );
  }

  renderError() {
    return (
      <View>
        <Text>
          Could not unlock with touch identification. Try unlocking with your
          pin code.
        </Text>
      </View>
    );
  }

  unlock() {
    this.requestAnimationFrame(async () => {
      try {
        await WalletService.unlock();
      } catch (err) {
        this.setState({ error: true });
        return;
      }
    });
  }
}

export default connect(state => ({}), dispatch => ({ dispatch }))(
  UnlockWithFingerScreen
);
