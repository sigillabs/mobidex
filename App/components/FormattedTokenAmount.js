import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { formatAmount, formatAmountWithDecimals } from '../../utils';
import FormattedSymbol from './FormattedSymbol';

export default class FormattedTokenAmount extends Component {
  render() {
    const { amount, decimals, symbol } = this.props;

    return (
      <Text {...this.props}>
        <Text>
          {decimals
            ? formatAmountWithDecimals(amount, decimals)
            : formatAmount(amount)}
        </Text>
        {symbol ? <Text> </Text> : null}
        {symbol ? <FormattedSymbol symbol={symbol} /> : null}
      </Text>
    );
  }
}

FormattedTokenAmount.propTypes = {
  amount: PropTypes.oneOfType([
    PropTypes.instanceOf(BigNumber),
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  decimals: PropTypes.number,
  symbol: PropTypes.string
};
