import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { Text } from 'react-native-elements';
import BigCenter from '../../components/BigCenter';
import Padding from '../../components/Padding';

export default class LoadingPreviewOrders extends Component {
  render() {
    return (
      <BigCenter>
        <ActivityIndicator />
        <Padding size={25} />
        <Text>Loading receipt...</Text>
      </BigCenter>
    );
  }
}
