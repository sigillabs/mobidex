import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import { Platform, TouchableHighlight, View } from 'react-native';
import { Text } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
import { unlock } from '../../thunks';
import Button from '../components/Button';
import * as WalletService from '../services/WalletService';
import NavigationService from '../services/NavigationService';

@reactMixin.decorate(TimerMixin)
export default class UnlockWithFingerScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      showUnlocking: false
    };
  }

  render() {
    if (this.state.showUnlocking) {
      return this.renderUnlocking();
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableHighlight onPress={() => this.unlock()}>
          <View>
            <MaterialIcon name="fingerprint" color="black" size={100} />
            <Text>Press to unlock</Text>
          </View>
        </TouchableHighlight>
        {this.state.error ? this.renderError() : <Text>Or</Text>}
        <TouchableHighlight
          onPress={() => NavigationService.navigate('UnlockWithPin')}
        >
          <Text>Unlock with pin</Text>
        </TouchableHighlight>
      </View>
    );
  }

  renderUnlocking() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1
        }}
      >
        <MaterialIcon name="fingerprint" color="green" size={100} />
        <Text>Start scanning your fingerprint</Text>
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
    this.setState({ showUnlocking: Platform.OS === 'android' });
    this.requestAnimationFrame(async () => {
      try {
        await WalletService.unlock();
      } catch (err) {
        this.setState({ error: true });
        return;
      } finally {
        this.setState({ showUnlocking: false });
      }

      NavigationService.navigate('Products');
    });
  }
}
