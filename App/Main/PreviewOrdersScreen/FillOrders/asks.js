import { BigNumber } from '0x.js';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { ZERO } from '../../../../constants/0x';
import * as AssetService from '../../../../services/AssetService';
import * as WalletService from '../../../../services/WalletService';
import {
  batchMarketBuy,
  batchMarketBuyWithEth,
  loadMarketBuyQuote
} from '../../../../thunks';
import BasePreviewFillOrders from './base';

class PreviewFillAsks extends Component {
  static get propTypes() {
    return {
      quote: PropTypes.object,
      quoteLoading: PropTypes.object,
      quoteError: PropTypes.object,
      amount: PropTypes.string.isRequired,
      baseAssetData: PropTypes.string.isRequired,
      quoteAssetData: PropTypes.string.isRequired
    };
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.quote === null) {
      return false;
    }

    return true;
  }

  componentDidMount() {
    const { amount, baseAssetData } = this.props;
    const asset = AssetService.findAssetByData(baseAssetData);
    const baseUnitAmount = Web3Wrapper.toBaseUnitAmount(
      new BigNumber(amount),
      asset.decimals
    );

    InteractionManager.runAfterInteractions(() =>
      this.props.dispatch(
        loadMarketBuyQuote(baseAssetData, baseUnitAmount, {
          slippagePercentage: 0.2,
          expiryBufferSeconds: 30,
          filterInvalidOrders: true
        })
      )
    );
  }

  render() {
    if (!this.props.quote) {
      return null;
    }

    return (
      <BasePreviewFillOrders
        {...this.props}
        buttonTitle={'Confirm Buy'}
        subtotal={this.getSubtotal()}
        fee={this.getTotalFee()}
        total={this.getTotal()}
        fillAction={this.getFillAction()}
      />
    );
  }

  getTotalFee() {
    return ZERO.toString();
  }

  getSubtotal() {
    const { quote } = this.props;
    const asset = AssetService.findAssetByData(quote.assetData);
    const amount = Web3Wrapper.toUnitAmount(
      quote.assetBuyAmount,
      asset.decimals
    );
    return amount
      .mul(quote.bestCaseQuoteInfo.ethPerAssetPrice)
      .negated()
      .toString();
  }

  getTotal() {
    const { quote } = this.props;
    const subtotal = this.getSubtotal(quote);
    return subtotal.toString();
  }

  getFillAction() {
    const { quote } = this.props;
    const asset = AssetService.findAssetByData(quote.assetData);
    const balance = WalletService.getAdjustedBalanceByAddress(asset.token);
    const amount = Web3Wrapper.toUnitAmount(
      quote.assetBuyAmount,
      asset.decimals
    );
    const quoteAmount = amount.mul(quote.worstCaseQuoteInfo.ethPerAssetPrice);
    if (quoteAmount.gt(balance)) {
      return batchMarketBuyWithEth;
    } else {
      return batchMarketBuy;
    }
  }
}

export default connect(
  ({
    quote: {
      buy: { quote, loading, error }
    }
  }) => ({ quote, quoteLoading: loading, quoteError: error }),
  dispatch => ({ dispatch })
)(PreviewFillAsks);
