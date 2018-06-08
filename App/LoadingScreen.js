import React, { Component } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
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
        <Image
          source={require('../images/logo-with-text/logo-with-text-transparent.png')}
          style={{
            marginHorizontal: 0,
            width: '100%',
            resizeMode: Image.resizeMode.contain
          }}
        />
        <ActivityIndicator size="large" color={colors.gray1} />
      </View>
    );
  }
}
