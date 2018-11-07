import { Web3Wrapper } from '@0xproject/web3-wrapper';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ZERO } from '../../../../constants/0x';
import * as AssetService from '../../../../services/AssetService';
import * as WalletService from '../../../../services/WalletService';
import { batchMarketBuy, batchMarketBuyWithEth } from '../../../../thunks';
import BasePreviewFillOrders from './base';

export default class PreviewFillAsks extends Component {
  render() {
    return (
      <BasePreviewFillOrders
        {...this.props}
        buttonTitle={'Confirm Buy'}
        getSubtotal={quote => this.getSubtotal(quote)}
        getTotalFee={quote => this.getTotalFee(quote)}
        getTotal={quote => this.getTotal(quote)}
        fillAction={quote => this.getFillAction(quote)}
      />
    );
  }

  getTotalFee() {
    return ZERO;
  }

  getSubtotal(quote) {
    const asset = AssetService.findAssetByData(quote.assetData);
    const amount = Web3Wrapper.toUnitAmount(
      quote.assetBuyAmount,
      asset.decimals
    );
    return amount.mul(quote.bestCaseQuoteInfo.ethPerAssetPrice).negated();
  }

  getTotal(quote) {
    const subtotal = this.getSubtotal(quote);
    return subtotal;
  }

  getFillAction(quote) {
    const asset = AssetService.findAssetByData(quote.assetData);
    const balance = WalletService.getAdjustedBalanceByAddress(asset.token);
    const amount = Web3Wrapper.toUnitAmount(
      quote.assetBuyAmount,
      asset.decimals
    );
    const quoteAmount = amount.mul(quote.worstCaseQuoteInfo.ethPerAssetPrice);
    if (quoteAmount.gt(balance)) {
      return batchMarketBuyWithEth(quote);
    } else {
      return batchMarketBuy(quote);
    }
  }
}

PreviewFillAsks.propTypes = {
  quote: PropTypes.object.isRequired,
  hideHeader: PropTypes.func.isRequired,
  showHeader: PropTypes.func.isRequired
};
