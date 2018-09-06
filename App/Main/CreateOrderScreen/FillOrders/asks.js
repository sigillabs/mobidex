import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavigationService from '../../../../services/NavigationService';
import { formatProduct } from '../../../../utils';
import BaseFillOrders from './base';

class FillAsks extends Component {
  render() {
    return (
      <BaseFillOrders
        baseToken={this.props.baseToken}
        quoteToken={this.props.quoteToken}
        buttonTitle={'Preview Buy Order'}
        inputTitle={'Buying'}
        getFillableOrders={(baseToken, quoteToken, amount) =>
          this.getFillableOrders(baseToken, quoteToken, amount)
        }
        preview={(baseToken, quoteToken, amount, orders) =>
          this.preview(baseToken, quoteToken, amount, orders)
        }
      />
    );
  }

  getOrders(baseToken, quoteToken) {
    const product = formatProduct(baseToken.symbol, quoteToken.symbol);
    const orderbook = this.props.orderbooks[product];
    if (!orderbook) {
      return null;
    }
    return orderbook.asks.slice();
  }

  getFillableOrders(baseToken, quoteToken, amount) {
    const orders = this.getOrders(baseToken, quoteToken);

    if (!orders) {
      return null;
    }

    const result = [];
    let amountInWEI = Web3Wrapper.toBaseUnitAmount(
      new BigNumber(amount),
      baseToken.decimals
    );

    while (amountInWEI.gt(0) && orders.length > 0) {
      const order = orders.shift();
      result.push(order);
      amountInWEI = amountInWEI.sub(order.makerAssetAmount);
    }

    return result;
  }

  preview(baseToken, quoteToken, amount, orders) {
    NavigationService.navigate('PreviewOrders', {
      type: 'fill',
      side: 'buy',
      amount: new BigNumber(amount || 0).toString(),
      product: { base: baseToken, quote: quoteToken },
      orders
    });
  }
}

FillAsks.propTypes = {
  baseToken: PropTypes.object.isRequired,
  quoteToken: PropTypes.object.isRequired,
  orderbooks: PropTypes.object.isRequired
};

export default connect(
  state => ({ orderbooks: state.relayer.orderbooks }),
  dispatch => ({ dispatch })
)(FillAsks);
