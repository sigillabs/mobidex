import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as TickerService from '../../../../services/TickerService';
import { fonts, styles } from '../../../../styles';
import DayChange from '../../../components/DayChange';
import OrderbookPrice from '../../../views/OrderbookPrice';
import TokenItem from './TokenItem';

class QuoteTokenItem extends Component {
  static get propTypes() {
    return {
      quoteToken: PropTypes.object,
      baseToken: PropTypes.object
    };
  }

  render() {
    const { quoteToken, baseToken } = this.props;

    if (!quoteToken) return null;
    if (!baseToken) return null;

    const tokenTicker = TickerService.getQuoteTicker(
      baseToken.symbol,
      quoteToken.symbol
    );
    const change = tokenTicker
      ? TickerService.get24HRChangePercent(tokenTicker).toNumber()
      : 0;
    const profitLossStyle = change >= 0 ? styles.profit : styles.loss;

    return (
      <TokenItem
        change={
          <DayChange
            quoteAssetData={quoteToken.assetData}
            baseAssetData={baseToken.assetData}
            style={[fonts.large, profitLossStyle]}
          />
        }
        price={
          <OrderbookPrice
            quoteAssetData={quoteToken.assetData}
            baseAssetData={baseToken.assetData}
            side={'buy'}
            style={[fonts.large, profitLossStyle]}
          />
        }
        {...this.props}
      />
    );
  }
}

export default connect(state => ({ ticker: state.ticker }))(QuoteTokenItem);
