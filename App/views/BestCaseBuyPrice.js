import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ZERO } from '../../constants/0x';
import FormattedTokenAmount from '../components/FormattedTokenAmount';

export default class BestCaseBuyPrice extends Component {
  static propTypes = {
    quote: PropTypes.shape({
      assetData: PropTypes.string.isRequired,
      assetSellAmount: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.instanceOf(BigNumber)
      ])
    }).isRequired,
    symbol: PropTypes.string
  };

  static defaultProps = {
    symbol: 'N/A'
  };

  render() {
    const { quote } = this.props;

    if (!quote) {
      return (
        <FormattedTokenAmount
          {...this.props}
          amount={ZERO}
          symbol={this.props.symbol}
          side={'buy'}
        />
      );
    }

    if (!quote.bestCaseQuoteInfo) {
      return (
        <FormattedTokenAmount
          {...this.props}
          amount={ZERO}
          symbol={this.props.symbol}
          side={'sell'}
        />
      );
    }

    return (
      <FormattedTokenAmount
        {...this.props}
        amount={quote.bestCaseQuoteInfo.ethPerAssetPrice}
        symbol={this.props.symbol}
        side={'buy'}
      />
    );
  }
}
