import { ZeroEx } from '0x.js';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { formatAmount } from '../../../utils';

class TokenItem extends Component {
  render() {
    let { token } = this.props;
    let { symbol, balance, decimals } = token;
    balance = ZeroEx.toUnitAmount(balance, decimals);

    return (
      <View style={[styles.container]}>
        <Text>{symbol.toString()}</Text>
        <Text />
        <Text>{formatAmount(balance)}</Text>
        <Text />
        <Text>
          (${formatAmount(balance.mul(this.props.forexPrices[symbol] || 0))})
        </Text>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 5
  }
};

export default connect(
  state => ({ forexPrices: state.forex.prices }),
  dispatch => ({ dispatch })
)(TokenItem);
