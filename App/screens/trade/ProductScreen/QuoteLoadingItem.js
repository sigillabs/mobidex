import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fonts } from '../../../../styles';
import DayChange from '../../../components/DayChange';
import OrderbookPrice from '../../../views/OrderbookPrice';
import TokenItem from './TokenItem';

class QuoteLoadingItem extends Component {
  static get propTypes() {
    return {
      quoteToken: PropTypes.object,
      baseToken: PropTypes.object
    };
  }

  render() {
    const { quoteToken, baseToken } = this.props;

    if (!quoteToken) return null;
    if (!baseToken) return null;

    return (
      <TokenItem
        change={
          <DayChange
            quoteAssetData={quoteToken.assetData}
            baseAssetData={baseToken.assetData}
            style={[fonts.large]}
          />
        }
        price={
          <OrderbookPrice
            quoteAssetData={quoteToken.assetData}
            baseAssetData={baseToken.assetData}
            side={'buy'}
            style={[fonts.large]}
          />
        }
        {...this.props}
      />
    );
  }
}

export default connect(state => ({ ticker: state.ticker }))(QuoteLoadingItem);
