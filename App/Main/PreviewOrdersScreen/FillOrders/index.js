import PropTypes from 'prop-types';
import React, { Component } from 'react';
import PreviewFillAsks from './asks';
import PreviewFillBids from './bids';

export default class PreviewFillOrders extends Component {
  render() {
    const amount = this.props.navigation.getParam('amount');
    const baseAssetData = this.props.navigation.getParam('baseAssetData');
    const quoteAssetData = this.props.navigation.getParam('quoteAssetData');
    if (this.props.navigation.state.params.side === 'buy') {
      return (
        <PreviewFillAsks
          amount={amount}
          baseAssetData={baseAssetData}
          quoteAssetData={quoteAssetData}
        />
      );
    } else {
      return (
        <PreviewFillBids
          amount={amount}
          baseAssetData={baseAssetData}
          quoteAssetData={quoteAssetData}
        />
      );
    }
  }
}

PreviewFillOrders.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired
  }).isRequired
};
