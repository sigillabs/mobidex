import React, { Component } from 'react';
import {
  InteractionManager,
  Platform,
  TouchableOpacity,
  View
} from 'react-native';
import { Text } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../../../styles';
import Button from '../../components/Button';
import * as WalletService from '../../../services/WalletService';
import { connect as connectNavigation } from '../../../navigation';

class UnlockWithTouchIdentification extends Component {
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
      <View style={styles.bigCenter}>
        <TouchableOpacity
          onPress={() => this.unlock()}
          style={[styles.bigBottom, styles.flex1]}
        >
          <View>
            <MaterialIcon name="fingerprint" color="black" size={100} />
            <Text>Press to unlock</Text>
          </View>
        </TouchableOpacity>
        <View style={[styles.padding2, styles.flex0]}>
          {this.state.error ? this.renderError() : <Text>Or</Text>}
        </View>
        <View style={[styles.bigTop, styles.flex1]}>
          <Button
            onPress={() =>
              this.props.navigation.push('navigation.tradeUnlockWithPin')
            }
            title={'Unlock with pin'}
            icon={<Ionicons name="ios-keypad" color="white" size={20} />}
          />
        </View>
      </View>
    );
  }

  renderUnlocking() {
    return (
      <View style={styles.bigCenter}>
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

      this.props.navigation.push('navigation.tradeInitial');
    });
  }

  cancel() {
    WalletService.cancelFingerPrintUnlock();
    this.setState({ showUnlocking: false });
  }
}

export default connectNavigation(UnlockWithTouchIdentification);
