import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ZERO } from '../../constants/0x';
import * as OrderService from '../../services/OrderService';
import * as TickerService from '../../services/TickerService';
import FormattedForexAmount from '../components/FormattedForexAmount';

function getPrice(orderbook, side) {
  if (side === 'buy') {
    return orderbook.asks.size > 0
      ? OrderService.getOrderPrice(orderbook.lowestAsk())
      : ZERO;
  } else {
    return orderbook.bids.size > 0
      ? OrderService.getOrderPrice(orderbook.highestBid())
      : ZERO;
  }
}

export class OrderbookForexPrice extends Component {
  render() {
    const { orderbooks, baseAssetData, quoteAssetData, side } = this.props;

    if (side !== 'buy' && side !== 'sell') {
      return <FormattedForexAmount {...this.props} amount={0} />;
    }

    const forexTicker = TickerService.getForexTicker();

    if (
      !orderbooks ||
      !orderbooks[baseAssetData] ||
      !orderbooks[baseAssetData][quoteAssetData] ||
      !forexTicker
    ) {
      return (
        <FormattedForexAmount
          {...this.props}
          assetData={quoteAssetData}
          amount={0}
        />
      );
    }

    const orderbook = orderbooks[baseAssetData][quoteAssetData];

    if (!orderbook) {
      return <FormattedForexAmount {...this.props} amount={0} />;
    }

    const price = getPrice(orderbook, side);

    return (
      <FormattedForexAmount
        {...this.props}
        amount={new BigNumber(price).mul(forexTicker.price)}
      />
    );
  }
}

OrderbookForexPrice.propTypes = {
  orderbooks: PropTypes.object.isRequired,
  quoteAssetData: PropTypes.string.isRequired,
  baseAssetData: PropTypes.string.isRequired,
  side: PropTypes.string.isRequired
};

OrderbookForexPrice.defaultProps = {
  side: 'buy'
};

export default connect(({ relayer: { orderbooks } }) => ({
  orderbooks
}))(OrderbookForexPrice);
