import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { formatMoney, getImage } from '../../../utils';
import * as TickerService from '../../services/TickerService';

export default class PortfolioDetails extends Component {
  render() {
    const { assets } = this.props;
    const balance = assets
      .map(a => ({
        ticker: TickerService.getForexTicker(a.symbol),
        balance: a.balance
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
