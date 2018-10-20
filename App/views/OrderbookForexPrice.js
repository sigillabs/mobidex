import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ZERO } from '../../constants/0x';
import * as AssetService from '../../services/AssetService';
import * as OrderService from '../../services/OrderService';
import * as TickerService from '../../services/TickerService';
import FormattedForexAmount from '../components/FormattedForexAmount';

export class OrderbookForexPrice extends Component {
  render() {
    const { orderbooks, product, side } = this.props;

    if (side !== 'buy' && side !== 'sell') {
      return <FormattedForexAmount {...this.props} amount={0} />;
    }

    const [baseTokenSymbol, quoteTokenSymbol] = product.split('-');
    const baseToken = AssetService.findAssetBySymbol(baseTokenSymbol);
    const quoteToken = AssetService.findAssetBySymbol(quoteTokenSymbol);
    const forexTicker = TickerService.getForexTicker();

    if (!baseToken || !quoteToken || !forexTicker) {
      return <FormattedForexAmount {...this.props} amount={0} />;
    }

    const orderbook = orderbooks[product];

    if (!orderbook) {
      return <FormattedForexAmount {...this.props} amount={0} />;
    }

    const price =
      orderbook.bids.length > 0
        ? OrderService.getOrderPrice(
            side === 'buy' ? orderbook.bids[0] : orderbook.asks[0]
          )
        : ZERO;

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
  product: PropTypes.string.isRequired,
  side: PropTypes.string.isRequired
};

export default connect(({ relayer: { orderbooks } }) => ({
  orderbooks
}))(OrderbookForexPrice);
