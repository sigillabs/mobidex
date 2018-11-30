import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { formatMoney, getImage } from '../../../../utils';
import * as TickerService from '../../../../services/TickerService';
import * as WalletService from '../../../../services/WalletService';

export default class PortfolioDetails extends Component {
  static propTypes = {
    assets: PropTypes.array.isRequired
  };

  render() {
    const { assets } = this.props;
    const balance = assets
      .filter(asset => Boolean(asset))
      .map(a => ({
        ticker: TickerService.getForexTicker(a.symbol),
        balance: WalletService.getBalanceByAddress(a.address)
      }))
      .filter(f => f.ticker && f.ticker.price)
      .map(f => ({
        ...f,
        price: parseFloat(f.ticker.price)
      }))
      .reduce((s, f) => new BigNumber(f.balance).mul(f.price).add(s), 0);

    return (
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 10,
          paddingBottom: 72
        }}
      >
        <Avatar
          size="large"
          rounded
          source={getImage('ETH')}
          activeOpacity={0.7}
        />
        <Text style={{ marginTop: 5 }}>{formatMoney(balance)}</Text>
      </View>
    );
  }
}
