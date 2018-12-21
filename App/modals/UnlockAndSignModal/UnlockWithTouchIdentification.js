import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { connect as connectNavigation } from '../../../navigation';
import { styles } from '../../../styles';
import { navigationProp } from '../../../types/props';
import Button from '../../components/Button';

class UnlockWithTouchIdentification extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      showPin: PropTypes.func.isRequired,
      showUnlocking: PropTypes.func.isRequired
    };
  }

  render() {
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
          <Text>Or</Text>
        </View>
        <View style={[styles.bigTop, styles.flex1]}>
          <Button
            onPress={this.props.showPin}
            title={'Unlock with pin'}
            icon={<Ionicons name="ios-keypad" color="white" size={20} />}
          />
        </View>
      </View>
    );
  }

  unlock = () => {
    this.props.showUnlocking();
  };
}

export default connectNavigation(UnlockWithTouchIdentification);
