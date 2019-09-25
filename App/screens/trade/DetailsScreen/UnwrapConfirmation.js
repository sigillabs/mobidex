import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Text} from 'react-native';
import FA from 'react-native-vector-icons/FontAwesome';
import {fonts, styles} from '../../../../styles';
import {BigNumberProp} from '../../../../types/props';
import BigCenter from '../../../components/BigCenter';
import EthereumAmount from '../../../components/EthereumAmount';

export default class UnwrapConfirmation extends Component {
  static get propTypes() {
    return {
      amount: BigNumberProp.isRequired,
      direction: PropTypes.oneOf(['wrap', 'unwrap']),
    };
  }

  render() {
    return (
      <BigCenter>
        <FA name="money" size={100} color="black" style={styles.mh2} />
        <Text>Unwrapping all Ethereum.</Text>
      </BigCenter>
    );
  }
}
