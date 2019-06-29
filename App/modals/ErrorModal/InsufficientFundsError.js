import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { colors } from '../../../styles';
import { WalletService } from '../../../services/WalletService';

// Error message:
// ${error_enum}: ${text}
export default class InsufficientFundsError extends Component {
  static test(error) {
    if (!error) return false;
    if (!error.message) return false;
    return error.message && error.message.indexOf('Insufficient funds.') === 0;
  }

  render() {
    const error = this.props.error.message;
    const x = error.indexOf('got:');
    const web3 = WalletService.instance.web3;
    
    let required = error.slice(0, x).replace( /[^0-9]/g , '');
    let available = error.slice(x).replace( /[^0-9]/g, '' );
    
    required = web3.utils.fromWei(required, 'ether');
    available = web3.utils.fromWei(available, 'ether');

    return (
      <Text style={styles.text}>
        Insufficient Funds: Required {required} and got {available} .
      </Text>
    );
  }
}

InsufficientFundsError.propTypes = {
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
