import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { Text } from 'react-native-elements';
import { colors } from '../../styles.js';
import LongButton from '../components/LongButton';
import Padding from '../components/Padding';

export default class Intro extends Component {
  render() {
    return (
      <View
        backgroundColor={colors.transparent}
        style={{
          flex: 1,
          alignItems: 'center',
          paddingTop: '35%',
          paddingRight: 10,
          paddingBottom: 10,
          paddingLeft: 10
        }}
      >
        <Image
          source={require('../../images/logo-with-text/logo-with-text-transparent.png')}
          style={{
            marginHorizontal: 0,
            width: '100%',
            resizeMode: Image.resizeMode.contain
          }}
        />
        <Padding size={20} />
        <Text h4>Trade ERC-20 Tokens.</Text>
        <Padding size={20} />
        <Text h6>To get started, Import a wallet.</Text>
        <Padding size={20} />
        <LongButton
          large
          onPress={() => this.props.navigation.push('Import')}
          title="Import"
        />
      </View>
    );
  }
}
