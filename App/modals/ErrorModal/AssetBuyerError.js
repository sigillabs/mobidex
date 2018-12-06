import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { colors } from '../../../styles';

// Error message:
// ${error_enum}: ${text}
export default class AssetBuyerError extends Component {
  static test(error) {
    if (!error) return false;
    if (!error.message) return false;
    return error.message.indexOf('ASSET_UNAVAILABLE:') === 0;
  }

  render() {
    return (
      <Text style={styles.text}>
        There is not enough liquidity to fill your order.
      </Text>
    );
  }
}

AssetBuyerError.propTypes = {
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
