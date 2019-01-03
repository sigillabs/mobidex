import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as TickerService from '../../../../services/TickerService';
import { fonts, styles } from '../../../../styles';
import DayChange from '../../../components/DayChange';
import OrderbookForexPrice from '../../../views/OrderbookForexPrice';
import TokenItem from './TokenItem';

class ForexTokenItem extends Component {
  static get propTypes() {
    return {
      quoteToken: PropTypes.object.isRequired,
      baseToken: PropTypes.object.isRequired
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
        price={
          <OrderbookForexPrice
            quoteAssetData={quoteToken.assetData}
            baseAssetData={baseToken.assetData}
            side={'buy'}
            style={[fonts.large, profitLossStyle]}
          />
        }
        change={
          <DayChange
            quoteAssetData={quoteToken.assetData}
            baseAssetData={baseToken.assetData}
            style={[fonts.large, profitLossStyle]}
          />
        }
        {...this.props}
      />
    );
  }
}

export default connect(state => ({ ticker: state.ticker }))(ForexTokenItem);
