import React, {Component} from 'react';
import {Text, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {styles} from '../../../../styles';
import BigCenter from '../../../components/BigCenter';

export default class EmptyWallet extends Component {
  render() {
    return (
      <BigCenter>
        <Entypo size={100} name="wallet" color="black" />
        <Text>
          You have an empty wallet. Transfer some ether to start using wallet.
        </Text>
      </BigCenter>
    );
  }
}
