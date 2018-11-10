import PropTypes from 'prop-types';
import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
import * as AssetService from '../../services/AssetService';
import NavigationService from '../../services/NavigationService';
import * as TickerService from '../../services/TickerService';
import {
  initialLoad,
  loadActiveTransactions,
  loadAllowances,
  loadAssets,
  loadBalances,
  loadOrderbooks,
  loadOrders,
  loadProducts,
  updateForexTickers,
  updateTokenTickers
} from '../../thunks';
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

TokenItem.propTypes = {
  baseToken: PropTypes.object.isRequired,
  quoteToken: PropTypes.object.isRequired,
  price: PropTypes.number.isRequired,
  change: PropTypes.number.isRequired,
  priceFormatter: PropTypes.func.isRequired
};

class BaseQuoteTokenItem extends Component {
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
            side={'sell'}
          />
        )}
        {...this.props}
      />
    );
  }
}

BaseQuoteTokenItem.propTypes = {
  quoteToken: PropTypes.object,
  baseToken: PropTypes.object
};

const QuoteTokenItem = connect(state => ({ ticker: state.ticker }))(
  BaseQuoteTokenItem
);

class BaseForexTokenItem extends Component {
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

BaseForexTokenItem.propTypes = {
  quoteToken: PropTypes.object.isRequired,
  baseToken: PropTypes.object.isRequired
};

const ForexTokenItem = connect(state => ({ ticker: state.ticker }))(
  BaseForexTokenItem
);

@reactMixin.decorate(TimerMixin)
class ProductScreen extends Component {
  static propTypes = {
    assets: PropTypes.array.isRequired,
    products: PropTypes.array.isRequired,
    showForexPrices: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false
    };
  }

  render() {
    const { assets, products } = this.props;
    const ProductItem = this.props.showForexPrices
      ? ForexTokenItem
      : QuoteTokenItem;

    let subview = null;

    if (!products || !products.length || !assets || !assets.length) {
      subview = (
        <EmptyList
          wrapperStyle={{
            height: '100%',
            width: '100%',
            justifyContent: 'flex-start'
          }}
        >
          <MutedText style={{ marginTop: 25 }}>Loading Products</MutedText>
        </EmptyList>
      );
    } else {
      subview = (
        <View style={{ width: '100%', backgroundColor: 'white' }}>
          {products.map((product, index) => {
            const fullTokenA = AssetService.findAssetByData(
              product.assetDataA.assetData
            );
            const fullTokenB = AssetService.findAssetByData(
              product.assetDataB.assetData
            );

            return (
              <TouchableOpacity
                key={`token-${index}`}
                onPress={() =>
                  NavigationService.navigate('Details', {
                    product: {
                      quote: fullTokenA,
                      base: fullTokenB
                    }
                  })
                }
              >
                <ProductItem quoteToken={fullTokenA} baseToken={fullTokenB} />
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => this.onRefresh()}
          />
        }
      >
        {subview}
      </ScrollView>
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
