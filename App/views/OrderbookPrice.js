import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as OrderService from '../../services/OrderService';
import * as TokenService from '../../services/TokenService';
import FormattedTokenAmount from '../components/FormattedTokenAmount';

export class OrderbookPrice extends Component {
  render() {
    const { orderbooks, product, side } = this.props;

    if (side !== 'buy' && side !== 'sell') {
      return <FormattedTokenAmount {...this.props} amount={0} />;
    }

    const [baseTokenSymbol, quoteTokenSymbol] = product.split('-');
    const baseToken = TokenService.findTokenBySymbol(baseTokenSymbol);
    const quoteToken = TokenService.findTokenBySymbol(quoteTokenSymbol);

    if (!baseToken || !quoteToken) {
      return <FormattedTokenAmount {...this.props} amount={0} />;
    }

    const orderbook = orderbooks[product];

    if (!orderbook) {
      return <FormattedTokenAmount {...this.props} amount={0} />;
    }

    const price = OrderService.getOrderPrice(
      side === 'buy' ? orderbook.bids[0] : orderbook.asks[0]
    );

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
