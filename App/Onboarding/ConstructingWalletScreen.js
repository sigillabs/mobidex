import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BigCenter from '../components/BigCenter';
import Padding from '../components/Padding';
import RotatingView from '../components/RotatingView';

export default class ConstructingWalletScreen extends Component {
  render() {
    return (
      <BigCenter>
        <RotatingView>
          <FontAwesome name="gear" size={100} />
        </RotatingView>
        <Padding size={25} />
        <Text>Constructing Wallet...</Text>
      </BigCenter>
    );
  }
}
