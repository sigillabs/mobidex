import { Web3Wrapper } from '@0xproject/web3-wrapper';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ZERO } from '../../../../constants/0x';
import * as AssetService from '../../../../services/AssetService';
import { batchMarketSell } from '../../../../thunks';
import BasePreviewFillOrders from './base';

export default class PreviewFillBids extends Component {
  render() {
    return (
      <BasePreviewFillOrders
        {...this.props}
        buttonTitle={'Confirm Sell'}
        getSubtotal={quote => this.getSubtotal(quote)}
        getTotalFee={quote => this.getTotalFee(quote)}
        getTotal={quote => this.getTotal(quote)}
        fillAction={batchMarketSell}
      />
    );
  }

  getTotalFee() {
    return ZERO;
  }

  getSubtotal(quote) {
    const asset = AssetService.findAssetByData(quote.assetData);
    const amount = Web3Wrapper.toUnitAmount(
      quote.assetSellAmount,
      asset.decimals
    );
    return amount.mul(quote.bestCaseQuoteInfo.ethPerAssetPrice);
  }

  getTotal(quote) {
    const subtotal = this.getSubtotal(quote);
    return subtotal;
  }
}

PreviewFillBids.propTypes = {
  quote: PropTypes.object.isRequired,
  hideHeader: PropTypes.func.isRequired,
  showHeader: PropTypes.func.isRequired
};
