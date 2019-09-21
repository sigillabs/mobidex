import React, {Component} from 'react';
import {Text} from 'react-native';
import FA from 'react-native-vector-icons/FontAwesome';
import {fonts, styles} from '../../../../styles';
import BigCenter from '../../../components/BigCenter';

export default class UnwrapConfirmation extends Component {
  render() {
    return (
      <BigCenter>
        <FA name="money" size={100} color="black" style={styles.mh2} />
        <Text>Unwrap All Wrapped ETH.</Text>
      </BigCenter>
    );
  }
}
