import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { colors } from '../styles';

export default class LoadingScreen extends Component {
  render() {
    return (
      <View
        backgroundColor={colors.transparent}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 10,
          paddingRight: 10,
          paddingBottom: 10,
          paddingLeft: 10
        }}
      >
        <Text h3>Not implemented yet</Text>
      </View>
    );
  }
}
