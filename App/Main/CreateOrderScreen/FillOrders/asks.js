import { BigNumber } from '0x.js';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavigationService from '../../../../services/NavigationService';
import * as OrderService from '../../../../services/OrderService';
import BestCaseBuyPrice from '../../../views/BestCaseBuyPrice';
import BaseFillOrders from './base';

class FillAsks extends Component {
  render() {
    return (
      <BaseFillOrders
        baseToken={this.props.baseToken}
        quoteToken={this.props.quoteToken}
        buttonTitle={'Preview Buy Order'}
        inputTitle={'Buying'}
        getQuote={(baseToken, quoteToken, amount) =>
          this.getQuote(baseToken, quoteToken, amount)
        }
        preview={quote => this.preview(quote)}
        renderQuote={quote => (
          <BestCaseBuyPrice
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
    return OrderService.getBuyAssetsQuoteAsync(
      baseToken.assetData,
      baseUnitAmount
    );
  }

  preview(quote) {
    NavigationService.navigate('PreviewOrders', {
      type: 'fill',
      side: 'buy',
      quote,
      product: {
        base: this.props.baseToken,
        quote: this.props.quoteToken
      }
    });
  }
}

FillAsks.propTypes = {
  baseToken: PropTypes.object.isRequired,
  quoteToken: PropTypes.object.isRequired
};

export default connect(() => ({}), dispatch => ({ dispatch }))(FillAsks);
