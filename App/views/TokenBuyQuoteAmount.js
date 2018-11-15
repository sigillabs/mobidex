import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as AssetService from '../../services/AssetService';
import TokenAmount from '../components/TokenAmount';
import BestCaseBuyPrice from './BestCaseBuyPrice';

class TokenBuyQuoteAmount extends Component {
  static get propTypes() {
    return {
      quote: PropTypes.object,
      defaultSymbol: PropTypes.string
    };
  }

  static get defaultProps() {
    return {
      defaultSymbol: 'N/A'
    };
  }

  render() {
    const { quote, defaultSymbol } = this.props;
    let symbol = defaultSymbol;

    if (quote) {
      symbol = AssetService.findAssetByData(quote.assetData).symbol;
    }

    return (
      <TokenAmount
        {...this.props}
        label={'Buying'}
        right={
          quote ? <BestCaseBuyPrice quote={quote} symbol={symbol} /> : null
        }
      />
    );
  }
}

export default connect(({ quote: { buy: { quote } } }) => ({ quote }))(
  TokenBuyQuoteAmount
);
