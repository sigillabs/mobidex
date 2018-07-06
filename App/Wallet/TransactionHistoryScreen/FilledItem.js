import React, { Component } from 'react';
import { connect } from 'react-redux';
import TransactionItem from './TransactionItem';
import { formatAmountWithDecimals, getTokenByAddress } from '../../../utils';

class FilledItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      makerToken: null,
      takerToken: null,
      ready: false
    };
  }

  async componentDidMount() {
    let [makerToken, takerToken] = await Promise.all([
      getTokenByAddress(this.props.web3, this.props.transaction.makerToken),
      getTokenByAddress(this.props.web3, this.props.transaction.takerToken)
    ]);
    this.setState({
      makerToken,
      takerToken,
      ready: true
    });
  }

  render() {
    if (!this.state.ready) {
      return null;
    }

    let {
      id,
      filledMakerTokenAmount,
      filledTakerTokenAmount,
      timestamp
    } = this.props.transaction;
    let { makerToken, takerToken } = this.state;

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
