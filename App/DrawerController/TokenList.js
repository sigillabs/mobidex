import { ZeroEx } from '0x.js';
import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { colors } from '../../styles';
import { formatAmount, getImage } from '../../utils';

class TokenItem extends Component {
  render() {
    let { token, ticker } = this.props;
    let { symbol, balance, decimals } = token;
    balance = ZeroEx.toUnitAmount(balance, decimals);

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{symbol.toString()}</Text>
        <Text style={styles.itemText}>{formatAmount(balance)}</Text>
        <Text style={styles.itemText}>
          (${formatAmount(balance.mul(this.props.ticker || 0))})
        </Text>
      </View>
    );
  }
}

class TokenList extends Component {
  render() {
    let { tokens } = this.props;

    return (
      <View style={{ width: '100%' }}>
        {tokens.map((token, index) => (
          <TouchableOpacity
            key={`token-${index}`}
            onPress={() => this.props.onPress(token)}
          >
            <ListItem
              roundAvatar
              bottomDivider
              avatar={{ source: getImage(token.symbol) }}
              title={
                <TokenItem
                  token={token}
                  ticker={this.props.ticker[token.symbol]}
                />
              }
              avatarOverlayContainerStyle={{ backgroundColor: 'transparent' }}
              containerStyle={[
                this.props.token &&
                  this.props.token.address === token.address &&
                  styles.highlight
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

const styles = {
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginLeft: 5,
    height: 25,
    width: '100%'
  },
  itemText: {
    marginLeft: 10
  },
  highlight: {
    backgroundColor: colors.grey3,
    borderColor: colors.grey3,
    borderWidth: 1
  }
};

export default connect(
  state => ({
    ...state.settings,
    ticker: state.ticker
  }),
  dispatch => ({ dispatch })
)(TokenList);
