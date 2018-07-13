import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import { Platform, TouchableHighlight, View } from 'react-native';
import { Text } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
import * as styles from '../../styles';
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
      <View style={styles.bigcenter}>
        <TouchableHighlight
          onPress={() => this.unlock()}
          style={[styles.bigcenter, styles.flex1]}
        >
          <View>
            <MaterialIcon name="fingerprint" color="black" size={100} />
            <Text>Press to unlock</Text>
          </View>
        </TouchableHighlight>
        <View style={[styles.bigtop, styles.flex1]}>
          {this.state.error ? this.renderError() : <Text>Or</Text>}
          <Button
            onPress={() => NavigationService.navigate('UnlockWithPin')}
            title={'Unlock with pin'}
            icon={<Ionicons name="ios-keypad" color="white" size={20} />}
          />
        </View>
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
