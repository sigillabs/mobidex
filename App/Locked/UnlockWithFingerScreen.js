import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import {
  InteractionManager,
  Platform,
  TouchableOpacity,
  View
} from 'react-native';
import { Text } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
import * as styles from '../../styles';
import { unlock } from '../../thunks';
import Button from '../components/Button';
import MutedText from '../components/MutedText';
import * as WalletService from '../../services/WalletService';
import NavigationService from '../../services/NavigationService';

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
        <TouchableOpacity
          onPress={() => this.unlock()}
          style={[styles.bigbottom, styles.flex1]}
        >
          <View>
            <MaterialIcon name="fingerprint" color="black" size={100} />
            <Text>Press to unlock</Text>
          </View>
        </TouchableOpacity>
        <View style={[styles.padding2, styles.flex0]}>
          {this.state.error ? this.renderError() : <Text>Or</Text>}
        </View>
        <View style={[styles.bigtop, styles.flex1]}>
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
      <View style={styles.bigcenter}>
        <MaterialIcon name="fingerprint" color="green" size={100} />
        <Text>Start scanning your fingerprint</Text>
        <Button
          onPress={() => this.cancel()}
          title={'Cancel'}
          icon={<MaterialIcon name="cancel" color="white" size={20} />}
        />
      </View>
    );
  }

  renderError() {
    return (
      <View style={[styles.padding3]}>
        <Text>
          Could not unlock with touch identification. Try unlocking with your
          pin code.
        </Text>
      </View>
    );
  }

  unlock() {
    this.setState({ showUnlocking: Platform.OS === 'android' });
    InteractionManager.runAfterInteractions(async () => {
      try {
        await WalletService.unlock();
      } catch (err) {
        this.setState({ error: true });
        return;
      } finally {
        this.setState({ showUnlocking: false });
      }

      NavigationService.navigate('Initial');
    });
  }

  cancel() {
    WalletService.cancelFingerPrintUnlock();
    this.setState({ showUnlocking: false });
  }
}
