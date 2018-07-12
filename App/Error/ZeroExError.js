import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Linking } from 'react-native';
import { Text } from 'react-native-elements';
import { colors } from '../../styles';

export default class ZeroExError extends Component {
  static test(error) {
    if (!error) return false;
    if (!error.message) return false;

    switch (error.message) {
      case 'INSUFFICIENT_WETH_BALANCE_FOR_WITHDRAWAL':
      case 'INSUFFICIENT_ETH_BALANCE_FOR_DEPOSIT':
      case 'ORDER_ALREADY_CANCELLED_OR_FILLED':
      case 'INSUFFICIENT_TAKER_ALLOWANCE':
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
      case 'ORDER_ALREADY_CANCELLED_OR_FILLED':
        return (
          <Text style={styles.text}>
            The order has already been filled or cancelled. Give our server 5 -
            10 minutes to update...
          </Text>
        );
      case 'INSUFFICIENT_TAKER_ALLOWANCE':
        return (
          <Text style={styles.text}>
            <Text>
              For some reason 0x cannot pull out funds from your wallet. It
              seems you have reached an error with Mobidex. Awesome!
            </Text>
            <Text
              onPress={() =>
                Linking.openURL(
                  'mailto://somethingemail@gmail.com&subject=abcdefg&body=body'
                )
              }
            >
              click here to notify the Mobidex team
            </Text>
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
    paddingBottom: 10
  }
};
