import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FillAsks from './asks';
import FillBids from './bids';

export default class FillOrders extends Component {
  render() {
    if (this.props.navigation.state.params.side === 'buy') {
      return (
        <FillAsks
          baseToken={this.props.navigation.state.params.product.base}
          quoteToken={this.props.navigation.state.params.product.quote}
        />
      );
    } else {
      return (
        <FillBids
          baseToken={this.props.navigation.state.params.product.base}
          quoteToken={this.props.navigation.state.params.product.quote}
        />
      );
    }
  }
}

FillOrders.propTypes = {
  navigation: PropTypes.object.isRequired
};
