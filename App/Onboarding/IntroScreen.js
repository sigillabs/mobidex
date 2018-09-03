import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { colors } from '../../styles.js';
import Button from '../components/Button';
import Padding from '../components/Padding';
import NavigationService from '../../services/NavigationService';

class Intro extends Component {
  render() {
    return (
      <View
        backgroundColor={colors.transparent}
        style={{
          flex: 1,
          alignItems: 'center',
          paddingTop: '15%',
          paddingRight: 10,
          paddingBottom: 10,
          paddingLeft: 10,
          width: '100%'
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
        <Text h6>
          To get started, Import your Meta Mask wallet using your seed words. It
          is the 12-word mnemonic Meta Mask gives while you are generating a
          wallet.
        </Text>
        <Padding size={20} />
        <Button
          large
          title="Let's Get Started"
          onPress={() => NavigationService.navigate('ImportMnemonic')}
        />
      </View>
    );
  }
}

export default connect(() => ({}), dispatch => ({ dispatch }))(Intro);
