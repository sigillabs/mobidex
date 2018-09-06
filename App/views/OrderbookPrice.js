import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ZeroExClient from '../../clients/0x';
import * as AssetService from '../../services/AssetService';
import * as OrderService from '../../services/OrderService';
import FormattedTokenAmount from '../components/FormattedTokenAmount';

function getPrice(orderbook, side) {
  if (side === 'buy') {
    return orderbook.bids.length > 0
      ? OrderService.getOrderPrice(orderbook.bids[0])
      : ZeroExClient.ZERO;
  } else {
    return orderbook.asks.length > 0
      ? OrderService.getOrderPrice(orderbook.asks[0])
      : ZeroExClient.ZERO;
  }
}

export class OrderbookPrice extends Component {
  render() {
    const { orderbooks, product, side } = this.props;

    if (side !== 'buy' && side !== 'sell') {
      return <FormattedTokenAmount {...this.props} amount={0} />;
    }

    const [baseTokenSymbol, quoteTokenSymbol] = product.split('-');
    const baseToken = AssetService.findAssetBySymbol(baseTokenSymbol);
    const quoteToken = AssetService.findAssetBySymbol(quoteTokenSymbol);

    if (!baseToken || !quoteToken) {
      return <FormattedTokenAmount {...this.props} amount={0} />;
    }

    const orderbook = orderbooks[product];

    if (!orderbook) {
      return <FormattedTokenAmount {...this.props} amount={0} />;
    }
    const price = getPrice(orderbook, side);

    return (
      <FormattedTokenAmount
        {...this.props}
        amount={price}
        symbol={quoteTokenSymbol}
        side={side}
      />
    );
  }
}

OrderbookPrice.propTypes = {
  orderbooks: PropTypes.object.isRequired,
  product: PropTypes.string.isRequired,
  side: PropTypes.string.isRequired
};

OrderbookPrice.defaultProps = {
  side: 'buy'
};

export default connect(({ relayer: { orderbooks } }) => ({
  orderbooks
}))(OrderbookPrice);
