import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import TransactionItem from './TransactionItem';
import { formatAmountWithDecimals } from '../../../utils';
import * as AssetService from '../../../services/AssetService';

class CancelledItem extends Component {
  static propTypes = {
    transaction: PropTypes.shape({
      id: PropTypes.string.isRequired,
      makerAssetAmount: PropTypes.string,
      takerAssetAmount: PropTypes.string,
      timestamp: PropTypes.string,
      makerAssetData: PropTypes.string,
      takerAssetData: PropTypes.string
    })
  };

  constructor(props) {
    super(props);

    this.state = {
      makerToken: null,
      takerToken: null,
      ready: false
    };
  }

  async componentDidMount() {
    const makerToken = AssetService.findAssetByData(
      this.props.transaction.makerAssetData
    );
    const takerToken = AssetService.findAssetByData(
      this.props.transaction.takerAssetData
    );
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
      makerAssetAmount,
      takerAssetAmount,
      timestamp
    } = this.props.transaction;
    let { makerToken, takerToken } = this.state;

    return (
      <TransactionItem
        action="CANCEL"
        label={'Cancelled'}
        source={{
          amount: formatAmountWithDecimals(
            makerAssetAmount,
            makerToken.decimals
          ),
          symbol: makerToken.symbol
        }}
        destination={{
          amount: formatAmountWithDecimals(
            takerAssetAmount,
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
)(CancelledItem);
