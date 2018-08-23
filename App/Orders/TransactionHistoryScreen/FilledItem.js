import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formatAmountWithDecimals } from '../../../utils';
import * as TokenService from '../../services/TokenService';
import TransactionItem from './TransactionItem';

class FilledItem extends Component {
  render() {
    let {
      id,
      filledMakerTokenAmount,
      filledTakerTokenAmount,
      timestamp
    } = this.props.transaction;
    let makerToken = TokenService.findTokenByAddress(
      this.props.transaction.makerToken ||
        this.props.transaction.makerTokenAddress
    );
    let takerToken = TokenService.findTokenByAddress(
      this.props.transaction.takerToken ||
        this.props.transaction.takerTokenAddress
    );

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
            filledMakerTokenAmount,
            makerToken.decimals
          ),
          symbol: makerToken.symbol
        }}
        destination={{
          amount: formatAmountWithDecimals(
            filledTakerTokenAmount,
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
