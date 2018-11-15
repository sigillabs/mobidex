import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import MutedText from '../components/MutedText';

class TokenBuyQuoteError extends Component {
  static get propTypes() {
    return {
      error: PropTypes.object
    };
  }

  render() {
    const { error, ...rest } = this.props;
    return error ? (
      <MutedText {...rest}>{this.renderMessage()}</MutedText>
    ) : null;
  }

  renderMessage() {
    const { error } = this.props;

    if (error.message === 'INSUFFICIENT_ASSET_LIQUIDITY') {
      return 'Your order is too big for our orderbooks currently. Try a limit order.';
    } else if (error.message.startsWith('ASSET_UNAVAILABLE')) {
      return 'Your order is too big for our orderbooks currently. Try a limit order.';
    } else {
      return error.message;
    }
  }
}

export default connect(({ quote: { buy: { error } } }) => ({
  error
}))(TokenBuyQuoteError);
