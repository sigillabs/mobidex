import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {styles} from '../../../../styles';

export default class EmptyWallet extends Component {
  render() {
    return (
      <View style={[styles.flex1]}>
        <Text>
          You have an empty wallet. Transfer some ether to start using wallet.
        </Text>
      </View>
    );
  }
}
