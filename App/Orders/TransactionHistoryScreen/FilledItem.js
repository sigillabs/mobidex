import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formatAmountWithDecimals } from '../../../utils';
import * as AssetService from '../../../services/AssetService';
import TransactionItem from './TransactionItem';

class FilledItem extends Component {
  static propTypes = {
    transaction: PropTypes.shape({
      id: PropTypes.string.isRequired,
      makerAssetAmount: PropTypes.string,
      makerAssetFilledAmount: PropTypes.string,
      takerAssetAmount: PropTypes.string,
      takerAssetFilledAmount: PropTypes.string,
      timestamp: PropTypes.string,
      makerAssetData: PropTypes.string,
      takerAssetData: PropTypes.string
    })
  };

  render() {
    let {
      makerAssetAmount,
      makerAssetFilledAmount,
      takerAssetAmount,
      takerAssetFilledAmount,
      makerAssetData,
      takerAssetData,
      timestamp
    } = this.props.transaction;
    let makerToken = AssetService.findAssetByData(makerAssetData);
    let takerToken = AssetService.findAssetByData(takerAssetData);

    if (!makerToken)
      makerToken = {
        decimals: 18,
        symbol: '?'
      };

    if (!takerToken)
      takerToken = {
        decimals: 18,
        symbol: '?'
      };

    return (
      <TransactionItem
        action="FILL"
        label={'Filled'}
        source={{
          amount: formatAmountWithDecimals(
            makerAssetAmount || makerAssetFilledAmount,
            makerToken.decimals
          ),
          symbol: makerToken.symbol
        }}
        destination={{
          amount: formatAmountWithDecimals(
            takerAssetAmount || takerAssetFilledAmount,
            takerToken.decimals
          ),
          symbol: takerToken.symbol
        }}
        timestamp={timestamp}
      />
    );
  }
}

export default connect(
  state => ({ ...state.wallet, ...state.device.layout }),
  dispatch => ({ dispatch })
)(FilledItem);
