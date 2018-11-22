import { BigNumber } from '0x.js';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { ZERO } from '../../../../constants/0x';
import * as AssetService from '../../../../services/AssetService';
import { batchMarketSell, loadMarketSellQuote } from '../../../../thunks';
import BasePreviewFillOrders from './base';

class PreviewFillBids extends Component {
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
        loadMarketSellQuote(baseAssetData, baseUnitAmount, {
          slippagePercentage: 0.2,
          expiryBufferSeconds: 30,
          filterInvalidOrders: true
        })
      )
    );
  }

  render() {
    return (
      <BasePreviewFillOrders
        {...this.props}
        buttonTitle={'Confirm Sell'}
        subtotal={this.getSubtotal()}
        fee={this.getTotalFee()}
        total={this.getTotal()}
        fillAction={batchMarketSell}
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
      quote.assetSellAmount,
      asset.decimals
    );
    return amount.mul(quote.bestCaseQuoteInfo.ethPerAssetPrice).toString();
  }

  getTotal() {
    const { quote } = this.props;
    const subtotal = this.getSubtotal(quote);
    return subtotal.toString();
  }
}

export default connect(
  ({
    quote: {
      sell: { quote, loading, error }
    }
  }) => ({ quote, quoteLoading: loading, quoteError: error }),
  dispatch => ({ dispatch })
)(PreviewFillBids);
