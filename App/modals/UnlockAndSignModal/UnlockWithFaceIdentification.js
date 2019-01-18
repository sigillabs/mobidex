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
import VerticalPadding from '../../components/VerticalPadding';

class UnlockWithFaceIdentification extends Component {
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
          onPress={this.finish}
          style={[styles.bigBottom, styles.flex1]}
        >
          <View style={[styles.center]}>
            <MaterialIcon name="face" color="black" size={100} />
            <Text>Press to unlock with Face ID</Text>
          </View>
        </TouchableOpacity>
        <VerticalPadding size={25} />
        <View style={[styles.padding2, styles.flex0]}>
          <Text>Or</Text>
        </View>
        <VerticalPadding size={25} />
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

  finish = pin => {
    this.props.showUnlocking(null, true);
  };
}

export default connectNavigation(UnlockWithFaceIdentification);
