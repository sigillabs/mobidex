import PropTypes from 'prop-types';
import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import { FlatList, TouchableOpacity } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
import * as AssetService from '../../services/AssetService';
import NavigationService from '../../services/NavigationService';
import * as TickerService from '../../services/TickerService';
import { initialLoad } from '../../thunks';
import {
  formatAmount,
  formatMoney,
  formatPercent,
  formatProduct
} from '../../utils';
import Col from '../components/Col';
import Row from '../components/Row';
import EmptyList from '../components/EmptyList';
import MutedText from '../components/MutedText';
import TokenIcon from '../components/TokenIcon';
import OrderbookPrice from '../views/OrderbookPrice';

class TokenItem extends Component {
  static get propTypes() {
    return {
      baseToken: PropTypes.object.isRequired,
      quoteToken: PropTypes.object.isRequired,
      price: PropTypes.number.isRequired,
      change: PropTypes.number.isRequired,
      priceFormatter: PropTypes.func.isRequired
    };
  }

  render() {
    const { baseToken, price, change, priceFormatter } = this.props;

    return (
      <ListItem
        roundAvatar
        bottomDivider
        leftElement={
          <TokenIcon
            token={baseToken}
            style={{ flex: 0 }}
            numberOfLines={1}
            showName={false}
            showSymbol={true}
          />
        }
        title={
          <Row style={[{ flex: 1 }, styles.itemContainer]}>
            <Col style={{ flex: 1 }}>
              <Text
                style={[
                  styles.large,
                  change >= 0 ? styles.profit : styles.loss
                ]}
              >
                {priceFormatter(price)}
              </Text>
              <MutedText>Price</MutedText>
            </Col>
            <Col style={{ flex: 1 }}>
              <Text
                style={[
                  styles.large,
                  change >= 0 ? styles.profit : styles.loss
                ]}
              >
                {formatPercent(change)}
              </Text>
              <MutedText>24 Hour Change</MutedText>
            </Col>
          </Row>
        }
        hideChevron={true}
      />
    );
  }
}

class BaseQuoteTokenItem extends Component {
  static get propTypes() {
    return {
      quoteToken: PropTypes.object,
      baseToken: PropTypes.object
    };
  }

  render() {
    const { quoteToken, baseToken } = this.props;

    if (!quoteToken) return null;
    if (!baseToken) return null;

    const tokenTicker = TickerService.getQuoteTicker(
      baseToken.symbol,
      quoteToken.symbol
    );

    if (!tokenTicker || !tokenTicker.price) {
      return (
        <TokenItem
          price={0}
          change={0}
          priceFormatter={v =>
            `${formatAmount(v)} ${
              quoteToken.symbol === 'WETH' ? 'ETH' : quoteToken.symbol
            }`
          }
          {...this.props}
        />
      );
    }

    return (
      <TokenItem
        price={TickerService.getCurrentPrice(tokenTicker)
          .abs()
          .toNumber()}
        change={TickerService.get24HRChangePercent(tokenTicker)
          .abs()
          .toNumber()}
        priceFormatter={v => (
          <OrderbookPrice
            product={formatProduct(baseToken.symbol, quoteToken.symbol)}
            default={v}
            side={'buy'}
          />
        )}
        {...this.props}
      />
    );
  }
}

const QuoteTokenItem = connect(state => ({ ticker: state.ticker }))(
  BaseQuoteTokenItem
);

class BaseForexTokenItem extends Component {
  static get propTypes() {
    return {
      quoteToken: PropTypes.object.isRequired,
      baseToken: PropTypes.object.isRequired
    };
  }

  render() {
    const { quoteToken, baseToken } = this.props;

    if (!quoteToken) return null;
    if (!baseToken) return null;

    const forexTicker = TickerService.getForexTicker(baseToken.symbol);
    const tokenTicker = TickerService.getQuoteTicker(
      baseToken.symbol,
      quoteToken.symbol
    );

    if (
      !forexTicker ||
      !tokenTicker ||
      !forexTicker.price ||
      !tokenTicker.price
    ) {
      return (
        <TokenItem
          price={0}
          change={0}
          priceFormatter={formatMoney}
          {...this.props}
        />
      );
    }

    return (
      <TokenItem
        price={TickerService.getCurrentPrice(forexTicker)
          .abs()
          .toNumber()}
        change={TickerService.get24HRChangePercent(forexTicker)
          .abs()
          .toNumber()}
        priceFormatter={formatMoney}
        {...this.props}
      />
    );
  }
}

const ForexTokenItem = connect(state => ({ ticker: state.ticker }))(
  BaseForexTokenItem
);

@reactMixin.decorate(TimerMixin)
class ProductScreen extends Component {
  static get propTypes() {
    return {
      assets: PropTypes.array.isRequired,
      products: PropTypes.array.isRequired,
      showForexPrices: PropTypes.bool.isRequired,
      dispatch: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false
    };
  }

  render() {
    const { products } = this.props;
    const ProductItem = this.props.showForexPrices
      ? ForexTokenItem
      : QuoteTokenItem;

    return (
      <FlatList
        data={products}
        keyExtractor={(item, index) => `token-${index}`}
        renderItem={({ item, index }) => {
          const quote = AssetService.findAssetByData(item.assetDataA.assetData);
          const base = AssetService.findAssetByData(item.assetDataB.assetData);
          return (
            <TouchableOpacity
              onPress={() =>
                NavigationService.navigate('Details', {
                  quote,
                  base
                })
              }
            >
              <ProductItem quoteToken={quote} baseToken={base} />
            </TouchableOpacity>
          );
        }}
        refreshing={this.state.refreshing}
        onRefresh={() => this.onRefresh()}
        ListEmptyComponent={() => (
          <EmptyList
            wrapperStyle={{
              height: '100%',
              width: '100%',
              justifyContent: 'flex-start'
            }}
          >
            <MutedText style={{ marginTop: 25 }}>Loading Products</MutedText>
          </EmptyList>
        )}
      />
    );
  }

  async onRefresh(reload = true) {
    this.setState({ refreshing: true });
    await this.props.dispatch(initialLoad(reload ? 3 : 0));
    this.setState({ refreshing: false });
  }
}

const styles = {
  itemContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: '100%'
  },
  center: {
    textAlign: 'center'
  },
  padBottom: {
    marginBottom: 5
  },
  padLeft: {
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
    ...state.wallet,
    ...state.settings,
    ticker: state.ticker
  }),
  dispatch => ({ dispatch })
)(ProductScreen);
