import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../styles';
import BigCenter from '../components/BigCenter';
import Padding from '../components/Padding';
import RotatingView from '../components/RotatingView';

export default class UnlockingScreen extends Component {
  render() {
    return (
      <BigCenter>
        <RotatingView>
          <FontAwesome name="unlock" color={colors.yellow0} size={100} />
        </RotatingView>
        <Padding size={25} />
        <Text>Unlocking Mobidex...</Text>
      </BigCenter>
    );
  }
}
