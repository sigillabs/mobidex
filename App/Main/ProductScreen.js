import PropTypes from 'prop-types';
import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import {
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  View
} from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
import {
  loadAssets,
  loadProducts,
  loadTokens,
  updateForexTickers,
  updateTokenTickers
} from '../../thunks';
import {
  detailsFromTicker,
  formatAmount,
  formatMoney,
  formatPercent
} from '../../utils';
import Col from '../components/Col';
import Row from '../components/Row';
import EmptyList from '../components/EmptyList';
import MutedText from '../components/MutedText';
import TokenIcon from '../components/TokenIcon';
import NavigationService from '../services/NavigationService';
import * as TickerService from '../services/TickerService';
import * as TokenService from '../services/TokenService';

class TokenItem extends Component {
  render() {
    const { baseToken, quoteToken, price, change, priceFormatter } = this.props;

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
                {`${priceFormatter(price)}`}
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
                {`${formatPercent(change)}`}
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
            `${formatAmount(v)} ${'WETH' ? 'ETH' : quoteToken.symbol}`
          }
          {...this.props}
        />
      );
    }

    const tokenDetails = detailsFromTicker(tokenTicker);

    return (
      <TokenItem
        price={Math.abs(tokenDetails.price)}
        change={Math.abs(tokenDetails.changePercent)}
        priceFormatter={v =>
          `${formatAmount(v)} ${'WETH' ? 'ETH' : quoteToken.symbol}`
        }
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

    const forexTicker = TickerService.getForexTicker(quoteToken.symbol);
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

    const forexDetails = detailsFromTicker(forexTicker);
    const tokenDetails = detailsFromTicker(tokenTicker);

    return (
      <TokenItem
        price={Math.abs(tokenDetails.price * forexDetails.price)}
        change={Math.abs(tokenDetails.changePercent)}
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
  constructor(props) {
    super(props);

    this.state = {
      refreshing: true
    };
  }

  UNSAFE_componentWillMount() {
    this.onRefresh();
  }

  render() {
    const { products } = this.props;
    const ProductItem = this.props.settings.showForexPrices
      ? ForexTokenItem
      : QuoteTokenItem;

    let subview = null;

    if (!products || !products.length) {
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
          {products.map(({ tokenA, tokenB }, index) => {
            const fullTokenA = TokenService.findTokenByAddress(tokenA.address);
            const fullTokenB = TokenService.findTokenByAddress(tokenB.address);

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

  onRefresh() {
    this.setState({ refreshing: true });
    this.requestAnimationFrame(async () => {
      await this.props.dispatch(loadProducts());
      await this.props.dispatch(loadTokens(true));
      await this.props.dispatch(loadAssets());
      await this.props.dispatch(updateForexTickers());
      await this.props.dispatch(updateTokenTickers());
      this.setState({ refreshing: false });
    });
  }
}

ProductScreen.propTypes = {
  products: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

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
    settings: state.settings,
    ticker: state.ticker
  }),
  dispatch => ({ dispatch })
)(ProductScreen);
