import { ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { List, ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { colors } from '../../styles';
import { formatAmount, getImage, getTokenByAddress, prices } from '../../utils';

function avg(arr) {
  return (
    arr.reduce((a, b) => {
      return a + b;
    }, 0) / arr.length
  );
}

function formatPercent(n) {
  return (Math.round(n * 10000) / 100).toString() + '%';
}

function formatMoney(n) {
  return '$' + (Math.round(n * 100) / 100).toString();
}

class ProductItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      symbolA: null,
      symbolB: null,
      decimalsA: 0,
      decimalsB: 0,
      pricesA: [],
      pricesB: []
    };
  }

  async componentDidMount() {
    let [tokenA, tokenB] = await Promise.all([
      getTokenByAddress(this.props.web3, this.props.tokenA.address),
      getTokenByAddress(this.props.web3, this.props.tokenB.address)
    ]);
    let [pricesA, pricesB] = await Promise.all([
      prices(tokenA.symbol),
      prices(tokenB.symbol)
    ]);
    this.setState({
      symbolA: tokenA.symbol,
      decimalsA: tokenA.decimals,
      symbolB: tokenB.symbol,
      decimalsB: tokenB.decimals,
      pricesA,
      pricesB
    });
  }

  render() {
    const { pricesA, symbolA, symbolB } = this.state;

    if (pricesA.length === 0) {
      return null;
    }

    const pricesAF = pricesA.map(({ price }) => parseFloat(price));
    const pastAF = avg(pricesAF.slice(pricesAF.length - 3, pricesAF.length));
    const currentAF = avg(pricesAF.slice(0, 3));
    const changeAF = currentAF - pastAF;
    const changeAP = changeAF / currentAF;

    return (
      <ListItem
        roundAvatar
        avatar={getImage(symbolA)}
        avatarOverlayContainerStyle={{ backgroundColor: 'transparent' }}
        title={symbolA ? symbolA.toString() : null}
        subtitle={
          <View style={styles.itemContainer}>
            <Text style={[styles.quoteToken, styles.itemText]}>
              {symbolB ? symbolB.toString() : null}
            </Text>
            <Text
              style={[
                styles.quoteToken,
                styles.itemText,
                changeAF >= 0 ? styles.profit : styles.loss
              ]}
            >
              {formatMoney(currentAF)}
            </Text>
            <Text
              style={[
                styles.quoteToken,
                styles.itemText,
                changeAF >= 0 ? styles.profit : styles.loss,
                styles.right
              ]}
            >
              {changeAF >= 0 ? '+' : '-'}
              {formatMoney(changeAF)} ({formatPercent(changeAP)})
            </Text>
          </View>
        }
        chevron={false}
      />
    );
  }
}

class ProductScreen extends Component {
  render() {
    let { products } = this.props;

    return (
      <List containerStyle={{ width: '100%' }}>
        {products.map(({ tokenA, tokenB }, index) => (
          <TouchableOpacity
            key={`token-${index}`}
            onPress={() =>
              this.props.navigation.push('Details', {
                product: { tokenA, tokenB }
              })
            }
          >
            <ProductItem tokenA={tokenA} tokenB={tokenB} />
          </TouchableOpacity>
        ))}
      </List>
    );
  }
}

const styles = {
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 25,
    width: '100%'
  },
  itemText: {
    marginLeft: 10
  },
  baseToken: {
    fontSize: 14
  },
  quoteToken: {
    fontSize: 8
  },
  profit: {
    color: 'green'
  },
  loss: {
    color: 'red'
  },
  right: {
    textAlign: 'right'
  }
};

export default connect(
  state => ({
    ...state.settings,
    ...state.relayer
  }),
  dispatch => ({ dispatch })
)(ProductScreen);
