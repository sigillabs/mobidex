import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import LongButton from '../components/LongButton';
import { colors } from '../../styles.js';

export default class Intro extends Component {
  render() {
    return (
      <View
        backgroundColor={colors.grey1}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 0,
          paddingRight: 10,
          paddingBottom: 10,
          paddingLeft: 10
        }}
      >
        <Text
          style={{
            fontSize: 35,
            color: 'white',
            fontWeight: 'bold',
            paddingBottom: 10
          }}
        >
          Mobidex
        </Text>
        <Avatar large />
        <Text
          style={{
            fontSize: 20,
            color: colors.yellow0,
            fontWeight: 'bold',
            paddingTop: 10,
            paddingBottom: 10
          }}
        >
          Welcome to Mobidex, a mobile-first decentralized trading platform.
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: 'white',
            paddingBottom: 100
          }}
        >
          To get started, Import a wallet.
        </Text>
        <LongButton
          large
          onPress={() => this.props.navigation.push('Import')}
          title="Import"
        />
      </View>
    );
  }
}
