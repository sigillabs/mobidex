import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { colors } from '../../../styles';

export default class ZeroExError extends Component {
  static test(error) {
    if (!error) return false;
    if (!error.message) return false;

    switch (error.message) {
      case 'ORDER_ALREADY_CANCELLED_OR_FILLED':
      case 'INSUFFICIENT_TAKER_ALLOWANCE':
      case 'INSUFFICIENT_TAKER_BALANCE':
      case 'INSUFFICIENT_ZRX_LIQUIDITY':
      case 'ORDER_FILL_AMOUNT_ZERO':
      case 'ORDER_REMAINING_FILL_AMOUNT_ZERO':
      case 'ERC20_TOKEN_CONTRACT_DOES_NOT_EXIST':
      case 'CONTRACT_NOT_DEPLOYED_ON_NETWORK':
      case 'INSUFFICIENT_ASSET_LIQUIDITY':
        return true;
    }

    return false;
  }

  render() {
    const { error } = this.props;
    switch (error.message) {
      case 'ORDER_FILL_AMOUNT_ZERO':
      case 'ORDER_REMAINING_FILL_AMOUNT_ZERO':
        return (
          <Text style={styles.text}>
            Mobidex is trying to fill some old orders! Give it another shot in a
            few minutes. Our servers could just be catching up.
          </Text>
        );
      case 'INSUFFICIENT_TAKER_BALANCE':
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
            For some reason 0x cannot pull out funds from your wallet. It seems
            you have reached an error with Mobidex. Awesome! You should probably
            reach out to the Mobidex team.
          </Text>
        );
      case 'CONTRACT_NOT_DEPLOYED_ON_NETWORK':
      case 'ERC20_TOKEN_CONTRACT_DOES_NOT_EXIST':
        return (
          <Text style={styles.text}>
            For some reason 0x cannot find the token on the ethereum blockchain.
            This is super weird. You should probably reach out to the Mobidex
            team.
          </Text>
        );

      case 'INSUFFICIENT_ASSET_LIQUIDITY':
        return (
          <Text style={styles.text}>
            There is not enough liquidity to fill your order.
          </Text>
        );

      case 'INSUFFICIENT_ZRX_LIQUIDITY':
        return (
          <Text style={styles.text}>
            You don't have enough ZRX to cover the fees. Go buy some!
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
