import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { colors } from '../../../styles';

// Error message:
// ${response.status} - ${response.statusText}\n${requestType} ${url}\n${text}
export default class RelayerError extends Component {
  static test(error) {
    if (!error) return false;
    if (!error.message) return false;
    return error.message.indexOf('400') === 0;
  }

  render() {
    const {
      source,
      data: { code, validationErrors }
    } = this.parseMessage();

    if (code === 100) {
      if (validationErrors.length > 0) {
        return validationErrors.map((ve, index) =>
          this.renderValidationError(ve, index)
        );
      } else if (
        ~source.toLowerCase().indexOf('post') &&
        ~source.toLowerCase().indexOf('order')
      ) {
        return <Text style={styles.text}>Your wallet is either locked or you do not have enough tokens to create the order.</Text>;
      } else {
        return <Text style={styles.text}>Error posting to relayer</Text>;
      }
    }

    return <Text style={styles.text}>Relayer failed for some reason</Text>;
  }

  renderValidationError(error, index) {
    const { reason } = error;

    if (~reason.toLowerCase().indexOf('below')) {
      return (
        <Text key={index} style={styles.text}>
          Price or amount is too low
        </Text>
      );
    }

    return (
      <Text key={index} style={styles.text}>
        {reason}
      </Text>
    );
  }

  parseMessage() {
    const { error } = this.props;
    const message = error.message;
    const lines = message.split('\n');
    const json = lines[lines.length - 1];
    return { source: lines[lines.length - 2], data: JSON.parse(json) };
  }
}

RelayerError.propTypes = {
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
