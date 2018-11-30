import React, { Component } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../../../styles';

export default class DisapprovingScreen extends Component {
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
        <FontAwesome name="lock" size={100} style={{ marginBottom: 25 }} />
        <Text
          style={{
            fontSize: 18,
            color: colors.primary,
            paddingBottom: 10,
            textAlign: 'center'
          }}
        >
          Locking...
        </Text>
        <ActivityIndicator size="large" color={colors.gray1} />
      </View>
    );
  }
}
