import { BigNumber } from '0x.js';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavigationService from '../../../../services/NavigationService';
import * as OrderService from '../../../../services/OrderService';
import BestCaseSellPrice from '../../../views/BestCaseSellPrice';
import BaseFillOrders from './base';

class FillBids extends Component {
  render() {
    return (
      <BaseFillOrders
        baseToken={this.props.baseToken}
        quoteToken={this.props.quoteToken}
        buttonTitle={'Preview Sell Order'}
        inputTitle={'Selling'}
        getQuote={(baseToken, quoteToken, amount) =>
          this.getQuote(baseToken, quoteToken, amount)
        }
        preview={quote => this.preview(quote)}
        renderQuote={quote => (
          <BestCaseSellPrice
            quote={quote}
            symbol={this.props.quoteToken.symbol}
          />
        )}
      />
    );
  }

  async getQuote(baseToken, quoteToken, amount) {
    const baseUnitAmount = Web3Wrapper.toBaseUnitAmount(
      new BigNumber(amount),
      baseToken.decimals
    );
    return OrderService.getSellAssetsQuoteAsync(
      baseToken.assetData,
      baseUnitAmount
    );
  }

  preview(quote) {
    NavigationService.navigate('PreviewOrders', {
      type: 'fill',
      side: 'sell',
      quote,
      product: {
        base: this.props.baseToken,
        quote: this.props.quoteToken
      }
    });
  }
}

FillBids.propTypes = {
  baseToken: PropTypes.object.isRequired,
  quoteToken: PropTypes.object.isRequired
};

export default connect(state => ({}), dispatch => ({ dispatch }))(FillBids);
