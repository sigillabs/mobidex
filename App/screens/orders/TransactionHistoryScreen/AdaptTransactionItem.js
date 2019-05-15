import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { formatAmount, formatAmountWithDecimals } from '../../../../lib/utils';
import * as AssetService from '../../../../services/AssetService';
import TransactionItem from './TransactionItem';
import CancelledItem from './CancelledItem';
import FilledItem from './FilledItem';

const LABEL_LOOKUP = {
  FILL: 'Fill',
  CANCEL: 'Cancel',
  MARKET_BUY: 'Market Buy',
  MARKET_SELL: 'Market Sell',
  SEND_ETHER: 'Send',
  SEND_TOKENS: 'Send',
  DEPOSIT: 'Wrapped',
  WITHDRAWAL: 'Unwrapped',
  APPROVAL: 'Approved'
};

function getToken(tx) {
  if (tx.address) {
    return AssetService.findAssetByAddress(tx.address);
  } else if (tx.quote) {
    return AssetService.findAssetByData(tx.quote.assetData);
  }

  return null;
}

export default class AdaptTransactionItem extends Component {
  static get propTypes() {
    return {
      transaction: PropTypes.object.isRequired,
      onPress: PropTypes.func.isRequired
    };
  }

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        {this.renderTransaction()}
      </TouchableOpacity>
    );
  }

  renderTransaction() {
    const token = getToken(this.props.transaction);
    const quote = this.props.transaction.quote;
    let txtype = this.props.transaction.status || this.props.transaction.type;
    const timestamp = this.props.transaction.timestamp
      ? this.props.transaction.timestamp.toString()
      : undefined;
    const decimals = token ? token.decimals : 18;

    if (txtype === 'DEPOSITED') txtype = 'DEPOSIT';
    else if (txtype === 'FILLED') txtype = 'FILL';

    switch (txtype) {
      case 'MARKET_BUY':
        /* eslint-disable */
        return (
          <TransactionItem
            action={txtype}
            label={LABEL_LOOKUP[txtype]}
            destination={{
              address: this.props.transaction.spender,
              amount:
                this.props.transaction.amount === 'UNLIMITED'
                  ? 'UNLIMITED'
                  : formatAmountWithDecimals(
                      quote.assetBuyAmount,
                      token ? token.decimals : 18
                    ),
              symbol: token ? token.symbol : 'Token'
            }}
            timestamp={timestamp}
          />
        );
      /* eslint-enable */
      case 'MARKET_SELL':
        /* eslint-disable */
        return (
          <TransactionItem
            action={txtype}
            label={LABEL_LOOKUP[txtype]}
            destination={{
              address: this.props.transaction.spender,
              amount:
                this.props.transaction.amount === 'UNLIMITED'
                  ? 'UNLIMITED'
                  : formatAmountWithDecimals(
                      quote.assetSellAmount,
                      token ? token.decimals : 18
                    ),
              symbol: token ? token.symbol : 'Token'
            }}
            timestamp={timestamp}
          />
        );
      /* eslint-enable */

      case 'APPROVAL':
        return (
          <TransactionItem
            action={txtype}
            label={LABEL_LOOKUP[txtype]}
            destination={{
              amount:
                this.props.transaction.amount === 'UNLIMITED'
                  ? 'UNLIMITED'
                  : formatAmount(this.props.transaction.amount),
              symbol: token ? token.symbol : 'Token'
            }}
            timestamp={timestamp}
          />
        );

      case 'DEPOSIT':
        return (
          <TransactionItem
            action={txtype}
            label={LABEL_LOOKUP[txtype]}
            source={{
              amount: formatAmountWithDecimals(
                this.props.transaction.amount,
                18
              ),
              symbol: 'ETH'
            }}
            timestamp={timestamp}
          />
        );

      case 'WITHDRAWAL':
        return (
          <TransactionItem
            action={txtype}
            label={LABEL_LOOKUP[txtype]}
            source={{
              amount: formatAmountWithDecimals(
                this.props.transaction.amount,
                18
              ),
              symbol: 'ETH'
            }}
            timestamp={timestamp}
          />
        );

      case 'FILL':
        return <FilledItem transaction={this.props.transaction} />;

      case 'CANCEL':
        return <CancelledItem transaction={this.props.transaction} />;

      case 'SEND_ETHER':
        return (
          <TransactionItem
            action={txtype}
            label={LABEL_LOOKUP[txtype]}
            source={{
              address: this.props.transaction.address,
              amount: formatAmount(this.props.transaction.amount),
              symbol: 'ETH'
            }}
            destination={{
              address: this.props.transaction.to,
              amount: formatAmount(this.props.transaction.amount),
              symbol: 'ETH'
            }}
          />
        );

      case 'SEND_TOKENS':
        return (
          <TransactionItem
            action={txtype}
            label={LABEL_LOOKUP[txtype]}
            address={this.props.transaction.address}
            source={{
              address: this.props.transaction.from,
              amount: formatAmountWithDecimals(
                this.props.transaction.amount,
                decimals
              ),
              symbol: token ? token.symbol : 'Token'
            }}
            destination={{
              address: this.props.transaction.to,
              amount: formatAmountWithDecimals(
                this.props.transaction.amount,
                decimals
              ),
              symbol: token ? token.symbol : 'Token'
            }}
          />
        );

      default:
        return (
          <TransactionItem
            action={txtype}
            label={LABEL_LOOKUP[txtype]}
            address={this.props.transaction.address}
            amount={formatAmount(this.props.transaction.amount)}
          />
        );
    }
  }
}
