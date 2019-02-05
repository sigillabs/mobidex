// import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import FormattedTokenAmount from '../../../components/FormattedTokenAmount';
import TokenItem from './TokenItem';

class QuoteLoadingItem extends Component {
  render() {
    return (
      <TokenItem
        change={
          <FormattedTokenAmount
            {...this.props}
            assetData={null}
            showSymbol={false}
            amount={0}
          />
        }
        price={
          <FormattedTokenAmount
            {...this.props}
            assetData={null}
            showSymbol={false}
            amount={0}
          />
        }
        {...this.props}
      />
    );
  }
}

export default connect(state => ({ ticker: state.ticker }))(QuoteLoadingItem);
