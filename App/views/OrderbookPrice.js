import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ZERO } from '../../constants/0x';
import * as AssetService from '../../services/AssetService';
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
    const { orderbooks, product, side } = this.props;

    if (side !== 'buy' && side !== 'sell') {
      return <FormattedTokenAmount {...this.props} amount={0} />;
    }

    const [baseTokenSymbol, quoteTokenSymbol] = product.split('-');
    const baseAsset = AssetService.findAssetBySymbol(baseTokenSymbol);
    const quoteAsset = AssetService.findAssetBySymbol(quoteTokenSymbol);

    if (!baseAsset || !quoteAsset) {
      return <FormattedTokenAmount {...this.props} amount={0} />;
    }

    const orderbook = orderbooks[baseAsset.assetData][quoteAsset.assetData];

    if (!orderbook) {
      return <FormattedTokenAmount {...this.props} amount={0} />;
    }

    const price = getPrice(orderbook, side);

    return <FormattedTokenAmount {...this.props} amount={price} />;
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
