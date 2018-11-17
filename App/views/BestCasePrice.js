import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { ZERO } from '../../constants/0x';
import TokenAmount from '../components/TokenAmount';

export default class BestCasePrice extends PureComponent {
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

  render() {
    const { quote } = this.props;

    if (!quote) {
      return (
        <TokenAmount
          {...this.props}
          label={'price'}
          amount={ZERO}
          symbol={this.props.symbol}
        />
      );
    }

    if (!quote.bestCaseQuoteInfo) {
      return (
        <TokenAmount
          {...this.props}
          label={'price'}
          amount={ZERO}
          symbol={this.props.symbol}
        />
      );
    }

    return (
      <TokenAmount
        {...this.props}
        label={'price'}
        amount={quote.bestCaseQuoteInfo.ethPerAssetPrice}
        symbol={this.props.symbol}
      />
    );
  }
}
