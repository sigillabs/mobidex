import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { formatMoney } from '../../utils';

export default class FormattedForexAmount extends Component {
  render() {
    const { amount } = this.props;

    return <Text {...this.props}>{formatMoney(amount)}</Text>;
  }
}

FormattedForexAmount.propTypes = {
  amount: PropTypes.oneOfType([
    PropTypes.instanceOf(BigNumber),
    PropTypes.number,
    PropTypes.string
  ]).isRequired
};
