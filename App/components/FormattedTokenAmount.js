import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Text } from 'react-native-elements';
import { formatAmount, formatAmountWithDecimals } from '../../utils';
import FormattedSymbol from './FormattedSymbol';

export default class FormattedTokenAmount extends PureComponent {
  render() {
    const { amount, percent, decimals, symbol } = this.props;
    const showPercent = percent !== null && percent !== undefined;

    return (
      <Text {...this.props}>
        <Text>
          {decimals
            ? formatAmountWithDecimals(amount, decimals)
            : formatAmount(amount)}
        </Text>
        {symbol || showPercent ? <Text> </Text> : null}
        {symbol ? <FormattedSymbol symbol={symbol} /> : null}
        {showPercent ? <Text>({percent})</Text> : null}
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
  percent: PropTypes.oneOfType([
    PropTypes.instanceOf(BigNumber),
    PropTypes.number,
    PropTypes.string
  ]),
  decimals: PropTypes.number,
  symbol: PropTypes.string
};
