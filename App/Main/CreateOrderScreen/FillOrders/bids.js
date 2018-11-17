import { BigNumber } from '0x.js';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavigationService from '../../../../services/NavigationService';
import { styles } from '../../../../styles';
import { loadMarketSellQuote } from '../../../../thunks';
import MutedText from '../../../components/MutedText';
import TokenSellQuoteAmount from '../../../views/TokenSellQuoteAmount';
import TokenSellQuoteError from '../../../views/TokenSellQuoteError';
import BaseFillOrders from './base';

class FillAsks extends Component {
  static get propTypes() {
    return {
      quote: PropTypes.object,
      isQuoteLoading: PropTypes.bool,
      quoteError: PropTypes.object,
      baseToken: PropTypes.object.isRequired,
      quoteToken: PropTypes.object.isRequired,
      dispatch: PropTypes.func.isRequired
    };
  }

  render() {
    const { isQuoteLoading, quote, quoteError } = this.props;
    const isQuoteEmpty = !quote || quote.orders.length === 0;

    return (
      <BaseFillOrders
        isQuoteLoading={isQuoteLoading}
        isQuoteEmpty={isQuoteEmpty}
        isQuoteError={Boolean(quoteError)}
        renderQuoteAmount={this.renderQuoteAmount}
        renderQuoteEmpty={this.renderQuoteEmpty}
        renderQuoteError={this.renderQuoteError}
        loadQuote={this.loadQuote}
        preview={this.preview}
      />
    );
  }

  renderQuoteAmount = amount => {
    const { baseToken, quoteToken } = this.props;
    return (
      <TokenSellQuoteAmount
        amount={amount.toString()}
        cursor={true}
        cursorProps={{ style: { marginLeft: 2 } }}
        format={false}
        baseSymbol={baseToken.symbol}
        quoteSymbol={quoteToken.symbol}
      />
    );
  };

  renderQuoteEmpty = () => {
    return (
      <MutedText
        style={[styles.flex1, styles.row, styles.center, styles.textCenter]}
      >
        There are no orders to fill.
      </MutedText>
    );
  };

  renderQuoteError = () => {
    return (
      <TokenSellQuoteError
        style={[styles.flex1, styles.row, styles.center, styles.textCenter]}
      />
    );
  };

  loadQuote = amount => {
    const { baseToken } = this.props;
    const baseUnitAmount = Web3Wrapper.toBaseUnitAmount(
      new BigNumber(amount || 0),
      baseToken.decimals
    );
    return this.props.dispatch(
      loadMarketSellQuote(baseToken.assetData, baseUnitAmount, {
        slippagePercentage: 0.2,
        expiryBufferSeconds: 30,
        filterInvalidOrders: false
      })
    );
  };

  preview = amount => {
    const baseAssetData = this.props.baseToken.assetData;
    const quoteAssetData = this.props.quoteToken.assetData;

    NavigationService.navigate('PreviewOrders', {
      type: 'fill',
      side: 'sell',
      amount,
      baseAssetData,
      quoteAssetData
    });
  };
}

export default connect(
  ({
    quote: {
      sell: { quote, loading, error }
    }
  }) => ({ quote, isQuoteLoading: loading, quoteError: error }),
  dispatch => ({ dispatch })
)(FillAsks);
