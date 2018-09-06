import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ZeroExClient from '../../../../clients/0x';
import * as OrderService from '../../../../services/OrderService';
import BasePreviewFillOrders from './base';

export default class PreviewFillBids extends Component {
  render() {
    return (
      <BasePreviewFillOrders
        {...this.props}
        buttonTitle={'Confirm Sell'}
        getSubtotal={(baseToken, quoteToken, amount) =>
          this.getSubtotal(baseToken, quoteToken, amount)
        }
        getTotalFee={(baseToken, quoteToken, amount) =>
          this.getTotalFee(baseToken, quoteToken, amount)
        }
        getTotal={(baseToken, quoteToken, amount) =>
          this.getTotal(baseToken, quoteToken, amount)
        }
      />
    );
  }

  getTotalFee() {
    return ZeroExClient.ZERO;
  }

  getSubtotal(baseToken, quoteToken, amount) {
    const priceAverage = OrderService.getAveragePrice(this.props.orders);
    return new BigNumber(amount).mul(priceAverage);
  }

  getTotal(baseToken, quoteToken, amount) {
    const subtotal = this.getSubtotal(baseToken, quoteToken, amount);
    return subtotal;
  }
}

PreviewFillBids.propTypes = {
  baseToken: PropTypes.object.isRequired,
  quoteToken: PropTypes.object.isRequired,
  amount: PropTypes.string.isRequired,
  fee: PropTypes.string.isRequired,
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  hideHeader: PropTypes.func.isRequired,
  showHeader: PropTypes.func.isRequired
};
