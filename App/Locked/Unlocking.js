import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { Text } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../styles';
import BigCenter from '../components/BigCenter';

export default class UnlockingScreen extends Component {
  render() {
    return (
      <BigCenter>
        <FontAwesome name="unlock" color={colors.yellow0} size={100} />
        <ActivityIndicator size="large" color={colors.gray1} />
        <Text>Unlocking Mobidex...</Text>
      </BigCenter>
    );
  }
}
