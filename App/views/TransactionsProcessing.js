import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { colors } from '../../styles';

export default class TransactionsProcessing extends Component {
  render() {
    return (
      <View
        backgroundColor={colors.grey1}
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
        <Text
          style={{
            fontSize: 18,
            color: 'white',
            paddingBottom: 10
          }}
        >
          Processing Transactions On Ethereum...
        </Text>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }
}
