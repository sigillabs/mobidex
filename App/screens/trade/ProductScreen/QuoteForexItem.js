import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as TickerService from '../../../../services/TickerService';
import { formatMoney } from '../../../../utils';
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

    const forexTicker = TickerService.getForexTicker(baseToken.symbol);
    const tokenTicker = TickerService.getQuoteTicker(
      baseToken.symbol,
      quoteToken.symbol
    );

    if (
      !forexTicker ||
      !tokenTicker ||
      !forexTicker.price ||
      !tokenTicker.price
    ) {
      return (
        <TokenItem
          price={0}
          change={0}
          priceFormatter={formatMoney}
          {...this.props}
        />
      );
    }

    return (
      <TokenItem
        price={TickerService.getCurrentPrice(forexTicker)
          .abs()
          .toNumber()}
        change={TickerService.get24HRChangePercent(forexTicker)
          .abs()
          .toNumber()}
        priceFormatter={formatMoney}
        {...this.props}
      />
    );
  }
}

export default connect(state => ({ ticker: state.ticker }))(ForexTokenItem);
