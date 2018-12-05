import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { gotoEtherScan } from '../../../../services/NavigationService';
import { transactionProp } from '../../../../types/props';
import { formatAmount, formatAmountWithDecimals } from '../../../../utils';
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

class TransactionsList extends Component {
  render() {
    const activeItems = this.props.active
      .filter(tx => Boolean(tx.id))
      .map((tx, index) => {
        const token = getToken(tx);
        const quote = tx.quote;
        let txtype = tx.status || tx.type;

        if (txtype === 'DEPOSITED') txtype = 'DEPOSIT';
        else if (txtype === 'FILLED') txtype = 'FILL';

        switch (txtype) {
          case 'MARKET_BUY':
          case 'MARKET_SELL':
            return (
              <TouchableOpacity key={`active-${index}`}>
                <TransactionItem
                  action={txtype}
                  label={LABEL_LOOKUP[txtype]}
                  destination={{
                    address: tx.spender,
                    amount:
                      /* eslint-disable */
                      tx.amount === 'UNLIMITED'
                        ? 'UNLIMITED'
                        : formatAmountWithDecimals(
                            quote.assetSellAmount || quote.assetBuyAmount,
                            token ? token.decimals : 18
                          ),
                    /* eslint-enable */
                    symbol: token ? token.symbol : 'Token'
                  }}
                  timestamp={tx.timestamp}
                />
              </TouchableOpacity>
            );

          case 'APPROVAL':
            return (
              <TouchableOpacity key={`active-${index}`}>
                <TransactionItem
                  action={txtype}
                  label={LABEL_LOOKUP[txtype]}
                  destination={{
                    amount:
                      tx.amount === 'UNLIMITED'
                        ? 'UNLIMITED'
                        : formatAmount(tx.amount),
                    symbol: token ? token.symbol : 'Token'
                  }}
                  timestamp={tx.timestamp}
                />
              </TouchableOpacity>
            );

          case 'DEPOSIT':
            return (
              <TouchableOpacity key={`active-${index}`}>
                <TransactionItem
                  action={txtype}
                  label={LABEL_LOOKUP[txtype]}
                  source={{
                    amount: formatAmountWithDecimals(tx.amount, 18),
                    symbol: 'ETH'
                  }}
                  timestamp={tx.timestamp}
                />
              </TouchableOpacity>
            );

          case 'WITHDRAWAL':
            return (
              <TouchableOpacity key={`active-${index}`}>
                <TransactionItem
                  action={txtype}
                  label={LABEL_LOOKUP[txtype]}
                  source={{
                    amount: formatAmountWithDecimals(tx.amount, 18),
                    symbol: 'ETH'
                  }}
                  timestamp={tx.timestamp}
                />
              </TouchableOpacity>
            );

          case 'FILL':
            return (
              <TouchableOpacity key={`active-${index}`}>
                <FilledItem transaction={tx} />
              </TouchableOpacity>
            );

          case 'CANCEL':
            return (
              <TouchableOpacity key={`active-${index}`}>
                <CancelledItem transaction={tx} />
              </TouchableOpacity>
            );

          case 'SEND_ETHER':
            return (
              <TouchableOpacity key={`active-${index}`}>
                <TransactionItem
                  action={txtype}
                  label={LABEL_LOOKUP[txtype]}
                  source={{
                    address: tx.address,
                    amount: formatAmount(tx.amount),
                    symbol: 'ETH'
                  }}
                  destination={{
                    address: tx.to,
                    amount: formatAmount(tx.amount),
                    symbol: 'ETH'
                  }}
                />
              </TouchableOpacity>
            );

          case 'SEND_TOKENS':
            return (
              <TouchableOpacity key={`active-${index}`}>
                <TransactionItem
                  action={txtype}
                  label={LABEL_LOOKUP[txtype]}
                  source={{
                    address: tx.address,
                    amount: formatAmount(tx.amount),
                    symbol: tx.token.symbol
                  }}
                  destination={{
                    address: tx.to,
                    amount: formatAmount(tx.amount),
                    symbol: tx.token.symbol
                  }}
                />
              </TouchableOpacity>
            );

          default:
            return (
              <TouchableOpacity key={`active-${index}`}>
                <TransactionItem
                  action={txtype}
                  label={LABEL_LOOKUP[txtype]}
                  address={tx.address}
                  amount={formatAmount(tx.amount)}
                />
              </TouchableOpacity>
            );
        }
      });

    const items = this.props.transactions.map((tx, index) => {
      const txtype = tx.status || tx.type;
      const token = getToken(tx);
      switch (txtype) {
        case 'APPROVAL':
          return (
            <TouchableOpacity
              key={`active-${index}`}
              onPress={() => gotoEtherScan(tx.id)}
            >
              <TransactionItem
                action={txtype}
                label={LABEL_LOOKUP[txtype]}
                destination={{
                  address: tx.spender,
                  amount:
                    tx.amount === 'UNLIMITED'
                      ? 'UNLIMITED'
                      : formatAmount(tx.amount),
                  symbol: token ? token.symbol : 'Token'
                }}
                timestamp={tx.timestamp}
              />
            </TouchableOpacity>
          );

        case 'DEPOSIT':
          return (
            <TouchableOpacity
              key={`active-${index}`}
              onPress={() => gotoEtherScan(tx.id)}
            >
              <TransactionItem
                action={txtype}
                label={LABEL_LOOKUP[txtype]}
                source={{
                  address: tx.sender,
                  amount: formatAmountWithDecimals(tx.amount, 18),
                  symbol: 'ETH'
                }}
                timestamp={tx.timestamp}
              />
            </TouchableOpacity>
          );

        case 'WITHDRAWAL':
          return (
            <TouchableOpacity
              key={`active-${index}`}
              onPress={() => gotoEtherScan(tx.id)}
            >
              <TransactionItem
                action={txtype}
                label={LABEL_LOOKUP[txtype]}
                source={{
                  address: tx.sender,
                  amount: formatAmountWithDecimals(tx.amount, 18),
                  symbol: 'ETH'
                }}
                timestamp={tx.timestamp}
              />
            </TouchableOpacity>
          );

        case 'FILL':
          return (
            <TouchableOpacity
              key={`tx-${index}`}
              onPress={() => gotoEtherScan(tx.id)}
            >
              <FilledItem transaction={tx} />
            </TouchableOpacity>
          );

        case 'CANCEL':
          return (
            <TouchableOpacity
              key={`tx-${index}`}
              onPress={() => gotoEtherScan(tx.id)}
            >
              <CancelledItem transaction={tx} />
            </TouchableOpacity>
          );

        case 'SEND_ETHER':
          return (
            <TouchableOpacity
              key={`tx-${index}`}
              onPress={() => gotoEtherScan(tx.id)}
            >
              <TransactionItem
                action={txtype}
                label={LABEL_LOOKUP[txtype]}
                source={{
                  address: tx.address,
                  amount: formatAmount(tx.amount),
                  symbol: 'ETH'
                }}
                destination={{
                  address: tx.to,
                  amount: tx.amount,
                  symbol: 'ETH'
                }}
              />
            </TouchableOpacity>
          );

        case 'SEND_TOKENS':
          return (
            <TouchableOpacity
              key={`tx-${index}`}
              onPress={() => gotoEtherScan(tx.id)}
            >
              <TransactionItem
                action={txtype}
                label={LABEL_LOOKUP[txtype]}
                source={{
                  address: tx.address,
                  amount: formatAmount(tx.amount),
                  symbol: tx.token.symbol
                }}
                destination={{
                  address: tx.to,
                  amount: formatAmount(tx.amount),
                  symbol: tx.token.symbol
                }}
              />
            </TouchableOpacity>
          );

        default:
          return (
            <TouchableOpacity
              key={`tx-${index}`}
              onPress={() => gotoEtherScan(tx.id)}
            >
              <TransactionItem
                action={txtype}
                label={LABEL_LOOKUP[txtype]}
                address={tx.address}
                amount={formatAmount(tx.amount)}
              />
            </TouchableOpacity>
          );
      }
    });

    return (
      <View>
        {activeItems}
        {items}
      </View>
    );
  }
}

TransactionsList.propTypes = {
  active: PropTypes.arrayOf(transactionProp),
  transactions: PropTypes.arrayOf(transactionProp)
};

export default connect(
  state => ({ ...state.device.layout, ...state.settings }),
  dispatch => ({ dispatch })
)(TransactionsList);
