import * as _ from 'lodash';
import { ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import {
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  View
} from 'react-native';
import { List, ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { colors } from '../../styles';
import { updateForexTickers, updateTokenTickers } from '../../thunks';
import {
  detailsFromTicker,
  formatAmount,
  formatMoney,
  formatPercent,
  getImage,
  getTokenByAddress,
  prices
} from '../../utils';

function avg(arr) {
  return (
    arr.reduce((a, b) => {
      return a + b;
    }, 0) / arr.length
  );
}

class ProductItem extends Component {
  render() {
    const { quoteToken, baseToken, forexTicker, tokenTicker } = this.props;
    const forexDetails = detailsFromTicker(forexTicker);
    const tokenDetails = detailsFromTicker(tokenTicker);

    return (
      <ListItem
        roundAvatar
        bottomDivider
        leftAvatar={{ source: getImage(baseToken.symbol) }}
        title={
          <View style={styles.itemContainer}>
            <Text style={[styles.large, styles.pad]}>{baseToken.symbol}</Text>
            <Text
              style={[
                styles.large,
                styles.pad,
                tokenDetails.changePrice >= 0 ? styles.profit : styles.loss
              ]}
            >
              {formatAmount(Math.abs(tokenDetails.price))} {quoteToken.symbol}
            </Text>
            <Text
              style={[
                styles.small,
                tokenDetails.changePrice >= 0 ? styles.profit : styles.loss,
                styles.right
              ]}
            >
              {formatAmount(Math.abs(tokenDetails.changePrice))} ({formatPercent(
                Math.abs(tokenDetails.changePercent)
              )})
            </Text>
          </View>
        }
        subtitle={
          <View style={styles.itemContainer}>
            <Text
              style={[
                styles.small,
                styles.pad,
                tokenDetails.changePrice >= 0 ? styles.profit : styles.loss
              ]}
            >
              {formatMoney(Math.abs(tokenDetails.price * forexDetails.price))}
            </Text>
            <Text
              style={[
                styles.small,
                tokenDetails.changePrice >= 0 ? styles.profit : styles.loss,
                styles.right
              ]}
            >
              {formatMoney(
                Math.abs(tokenDetails.changePrice * forexDetails.price)
              )}
            </Text>
          </View>
        }
        hideChevron={true}
      />
    );
  }
}

class ProductScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: true
    };
  }

  async componentDidMount() {
    await this.onRefresh();
  }

  render() {
    const { products, forexCurrency } = this.props;
    const forexTickers = this.props.ticker.forex;
    const tokenTickers = this.props.ticker.token;

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
      >
        <View style={{ width: '100%', backgroundColor: 'white' }}>
          {products.map(({ tokenA, tokenB }, index) => {
            const fullTokenA = _.find(this.props.assets, {
              address: tokenA.address
            });
            const fullTokenB = _.find(this.props.assets, {
              address: tokenB.address
            });

            if (!fullTokenA) return null;
            if (!fullTokenB) return null;

            const quoteSymbol = fullTokenA.symbol;

            if (!forexTickers[fullTokenA.symbol]) return null;
            if (!forexTickers[fullTokenA.symbol][forexCurrency]) return null;
            if (!tokenTickers[fullTokenB.symbol]) return null;
            if (!tokenTickers[fullTokenB.symbol][quoteSymbol]) return null;

            const forexTickerA = forexTickers[fullTokenA.symbol][forexCurrency];
            const tokenTickerB = tokenTickers[fullTokenB.symbol][quoteSymbol];

            return (
              <TouchableOpacity
                key={`token-${index}`}
                onPress={() =>
                  this.props.navigation.push('Details', {
                    product: { tokenA, tokenB }
                  })
                }
              >
                <ProductItem
                  quoteToken={fullTokenA}
                  baseToken={fullTokenB}
                  forexTicker={forexTickerA}
                  tokenTicker={tokenTickerB}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.props.dispatch(updateForexTickers());
    await this.props.dispatch(updateTokenTickers());
    this.setState({ refreshing: false });
  };
}

const styles = {
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 25,
    marginHorizontal: 10,
    width: '100%'
  },
  pad: {
    marginLeft: 10
  },
  small: {
    fontSize: 10
  },
  large: {
    fontSize: 14
  },
  profit: {
    color: 'green'
  },
  loss: {
    color: 'red'
  },
  right: {
    flex: 1,
    textAlign: 'right',
    marginHorizontal: 10
  }
};

export default connect(
  state => ({
    ...state.relayer,
    ...state.settings,
    ...state.wallet,
    ticker: state.ticker
  }),
  dispatch => ({ dispatch })
)(ProductScreen);
