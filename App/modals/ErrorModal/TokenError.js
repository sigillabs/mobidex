import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { colors } from '../../../styles';

export default class ZeroExError extends Component {
  static test(error) {
    if (!error) return false;
    if (!error.message) return false;

    switch (error.message) {
      case 'INSUFFICIENT_BALANCE_FOR_TRANSFER':
      case 'INSUFFICIENT_WETH_BALANCE_FOR_WITHDRAWAL':
      case 'INSUFFICIENT_ETH_BALANCE_FOR_DEPOSIT':
        return true;
    }

    return false;
  }

  render() {
    const { error } = this.props;
    switch (error.message) {
      case 'INSUFFICIENT_WETH_BALANCE_FOR_WITHDRAWAL':
        return (
          <Text style={styles.text}>
            You are trying to withdraw too much Ether!
          </Text>
        );

      case 'INSUFFICIENT_ETH_BALANCE_FOR_DEPOSIT':
        return (
          <Text style={styles.text}>
            You do not have enough Ether for the transaction!
          </Text>
        );

      case 'INSUFFICIENT_BALANCE_FOR_TRANSFER':
        return (
          <Text style={styles.text}>
            You do not have enough tokens to send!
          </Text>
        );
    }
  }
}

ZeroExError.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired
  }).isRequired
};

const styles = {
  text: {
    fontSize: 18,
    color: colors.primary,
    paddingBottom: 10,
    textAlign: 'center'
  }
};
