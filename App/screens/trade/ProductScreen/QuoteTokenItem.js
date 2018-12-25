import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as TickerService from '../../../../services/TickerService';
import { formatAmount, formatProduct } from '../../../../utils';
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

    if (!tokenTicker || !tokenTicker.price) {
      return (
        <TokenItem
          price={0}
          change={0}
          priceFormatter={v =>
            `${formatAmount(v)} ${
              quoteToken.symbol === 'WETH' ? 'ETH' : quoteToken.symbol
            }`
          }
          {...this.props}
        />
      );
    }

    return (
      <TokenItem
        price={TickerService.getCurrentPrice(tokenTicker)
          .abs()
          .toNumber()}
        change={TickerService.get24HRChangePercent(tokenTicker).toNumber()}
        priceFormatter={v => (
          <OrderbookPrice
            product={formatProduct(baseToken.symbol, quoteToken.symbol)}
            default={v}
            side={'buy'}
          />
        )}
        {...this.props}
      />
    );
  }
}

export default connect(state => ({ ticker: state.ticker }))(QuoteTokenItem);
