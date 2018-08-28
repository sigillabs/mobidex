import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FormattedTokenAmount from './FormattedTokenAmount';
import * as WalletService from '../../services/WalletService';

export default class FormattedAdjustedTokenBalance extends Component {
  render() {
    const { symbol, ...rest } = this.props;
    const balance = WalletService.getAdjustedBalanceBySymbol(symbol);

    return <FormattedTokenAmount amount={balance} symbol={symbol} {...rest} />;
  }
}

FormattedAdjustedTokenBalance.propTypes = {
  symbol: PropTypes.string
};
