import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ZERO } from '../../constants/0x';
import * as OrderService from '../../services/OrderService';
import FormattedTokenAmount from '../components/FormattedTokenAmount';

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

export class OrderbookPrice extends Component {
  render() {
    const { orderbooks, baseAssetData, quoteAssetData, side } = this.props;

    if (side !== 'buy' && side !== 'sell') {
      return (
        <FormattedTokenAmount
          {...this.props}
          assetData={null}
          showSymbol={false}
          amount={0}
        />
      );
    }

    if (
      !orderbooks ||
      !orderbooks[baseAssetData] ||
      !orderbooks[baseAssetData][quoteAssetData]
    ) {
      return (
        <FormattedTokenAmount
          {...this.props}
          assetData={null}
          showSymbol={false}
          amount={0}
        />
      );
    }

    const orderbook = orderbooks[baseAssetData][quoteAssetData];

    if (!orderbook) {
      return (
        <FormattedTokenAmount
          {...this.props}
          assetData={quoteAssetData}
          amount={0}
        />
      );
    }

    const price = getPrice(orderbook, side);

    return (
      <FormattedTokenAmount
        {...this.props}
        assetData={quoteAssetData}
        amount={price}
      />
    );
  }
}

OrderbookPrice.propTypes = {
  orderbooks: PropTypes.object.isRequired,
  quoteAssetData: PropTypes.string.isRequired,
  baseAssetData: PropTypes.string.isRequired,
  side: PropTypes.string.isRequired
};

OrderbookPrice.defaultProps = {
  side: 'buy'
};

export default connect(({ relayer: { orderbooks } }) => ({
  orderbooks
}))(OrderbookPrice);
