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
class Unlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pin: '',
      pinError: false
    };
  }

  onSetPin = value => {
    this.setState({ pin: value, pinError: false });
  };

  unlock = () => {
    if (this.state.pin.length != 6) {
      this.setState({ pinError: true });
      return;
    }

    this.requestAnimationFrame(async () => {
      try {
        await WalletService.unlock(this.state.pin);
      } catch (err) {
        this.setState({ pinError: true });
        return;
      }

      if (this.props.onFinish) await this.props.onFinish();
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {/*<LongInput
          secureTextEntry={true}
          placeholder="Pin"
          onChangeText={this.onSetPin}
          errorMessage={
            this.state.pinError
              ? 'Wrong or poorly formatted pin. Pins must be 6 characters long.'
              : null
          }
          errorStyle={{ color: 'red' }}
          leftIcon={<Icon name="person" size={24} color="black" />}
          containerStyle={{ marginBottom: 10 }}
        />*/}
        {/*<Button
          large
          title="Unlock"
          onPress={this.unlock}
          containerStyle={{ width: '100%' }}
        />*/}
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
          onChange={value => this.setState({ pin: value })}
          onSubmit={() => this.unlock()}
        />
      </View>
    );
  }
}

export default connect(state => ({}), dispatch => ({ dispatch }))(Unlock);
