import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { ZeroEx } from '0x.js';
import { formatAmount } from '../../../utils';

class OrderItem extends Component {
  render() {
    let { order, quoteToken, baseToken, address } = this.props;
    let price, amount;

    if (order.maker.toLowerCase() !== address.toLowerCase()) {
      // This should not happen... get of here!
    }

    if (
      order.makerTokenAddress.toLowerCase() === quoteToken.address.toLowerCase()
    ) {
      // BID
      amount = ZeroEx.toUnitAmount(order.takerTokenAmount, baseToken.decimals);
      price = ZeroEx.toUnitAmount(
        order.makerTokenAmount,
        quoteToken.decimals
      ).div(amount);
    } else if (
      order.takerTokenAddress.toLowerCase() === quoteToken.address.toLowerCase()
    ) {
      // ASK
      amount = ZeroEx.toUnitAmount(order.makerTokenAmount, baseToken.decimals);
      price = ZeroEx.toUnitAmount(
        order.takerTokenAmount,
        quoteToken.decimals
      ).div(amount);
    } else {
      // This should not happen... get of here!
    }

    return (
      <View>
        <View style={styles.container}>
          <Text style={styles.datum}>
            {formatAmount(price.isFinite() ? price : 0)} {quoteToken.symbol}
          </Text>
          <Text style={styles.datum}>
            {formatAmount(amount)} {baseToken.symbol}
          </Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.header}>Price</Text>
          <Text style={styles.header}>Amount</Text>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  datum: {
    textAlign: 'center',
    flex: 1
  },
  header: {
    textAlign: 'center',
    color: 'gray',
    flex: 1,
    fontSize: 10
  }
};

export default connect(
  state => ({ ...state.wallet, ...state.settings }),
  dispatch => ({ dispatch })
)(OrderItem);
