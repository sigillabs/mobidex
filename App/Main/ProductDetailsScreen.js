import * as _ from 'lodash';
import React, { Component } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Card, Header, ListItem, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import { getProfitLossStyle } from '../../styles';
import { updateForexTickers, updateTokenTickers } from '../../thunks';
import {
  detailsFromTicker,
  history as fetchHistory,
  formatAmount,
  formatMoney,
  formatPercent,
  getPriceChangeFromTicker
} from '../../utils';
import Button from '../components/Button';
import ButtonGroup from '../components/ButtonGroup';
import Divider from '../components/Divider';
import Padding from '../components/Padding';
import Row from '../components/Row';
import NavigationService from '../services/NavigationService';
import * as TickerService from '../services/TickerService';
import * as TokenService from '../services/TokenService';
import LogoTicker from '../views/LogoTicker';
import PriceGraph from '../views/PriceGraph';

class ProductDetailListItem extends Component {
  render() {
    const { left, right, leftStyle, rightStyle, ...rest } = this.props;

    return (
      <ListItem
        title={
          <Row style={{ flex: 1 }}>
            <Text style={[{ flex: 1, textAlign: 'left' }, leftStyle]}>
              {left}
            </Text>
            <Text style={[{ flex: 1, textAlign: 'right' }, rightStyle]}>
              {right}
            </Text>
          </Row>
        }
        bottomDivider
        {...rest}
      />
    );
  }
}

class ProductDetailsView extends Component {
  render() {
    const { base, quote, period, infolist, history } = this.props;

    return (
      <View style={[styles.container]}>
        <PriceGraph
          interval={period}
          height={200}
          data={history}
          label={'Last 30 Days'}
          formatAmount={this.props.formatAmount}
        />
        <Divider style={{ marginTop: 0 }} />
        <Row style={{ justifyContent: 'center' }}>
          <Button
            large
            icon={
              <Icon name="arrow-with-circle-left" size={20} color="white" />
            }
            onPress={() =>
              NavigationService.navigate('CreateOrder', {
                product: { base, quote },
                type: 'fill',
                side: 'buy'
              })
            }
            title="Buy"
            containerStyle={{ width: 150, alignSelf: 'center' }}
          />
          <Button
            large
            icon={
              <Icon name="arrow-with-circle-right" size={20} color="white" />
            }
            onPress={() =>
              NavigationService.navigate('CreateOrder', {
                product: { base, quote },
                type: 'fill',
                side: 'sell'
              })
            }
            title="Sell"
            containerStyle={{ width: 150, alignSelf: 'center' }}
          />
        </Row>
        <Padding size={10} />
        {infolist.map(({ key, left, right, leftStyle, rightStyle }, index) => (
          <ProductDetailListItem
            key={key}
            left={left}
            right={right}
            leftStyle={leftStyle}
            rightStyle={rightStyle}
            topDivider={index === 0}
          />
        ))}
      </View>
    );
  }
}

class TokenProductDetailsView extends Component {
  render() {
    const { base, quote, periodIndex, periods } = this.props;
    const ticker = TickerService.getQuoteTicker(base.symbol, quote.symbol);

    if (!ticker || !ticker.history) return null;

    const period = ProductDetailsScreen.periods[periodIndex].toLowerCase();
    const history = ticker.history[period];
    const { changePrice, changePercent, dayAverage } = detailsFromTicker(
      ticker
    );
    const infolist = [
      {
        key: 'price',
        left: 'Price',
        right: `${formatAmount(ticker.price || 0)} ${quote.symbol}`
      },
      {
        key: '24hrprice',
        left: '24 Hour Price Average',
        right: `${formatAmount(dayAverage || 0)} ${quote.symbol}`
      },
      {
        key: '24hrpricechange',
        left: '24 Hour Price Change',
        right:
          ticker.daymax !== null
            ? `${changePrice < 0 ? '-' : ''}${formatAmount(
                Math.abs(changePrice || 0)
              )} ${quote.symbol} (${formatPercent(changePercent || 0)})`
            : 'N/A',
        rightStyle: getProfitLossStyle(changePercent || 0)
      },
      {
        key: '24hrmax',
        left: '24 Hour Max',
        right:
          ticker.daymax !== null
            ? `${formatAmount(ticker.daymax)} ${quote.symbol}`
            : 'N/A'
      },
      {
        key: '24hrmin',
        left: '24 Hour Min',
        right:
          ticker.daymin !== null
            ? `${formatAmount(ticker.daymin)} ${quote.symbol}`
            : 'N/A'
      }
    ];

    return (
      <ProductDetailsView
        base={base}
        quote={quote}
        period={period}
        infolist={infolist}
        history={history}
        formatAmount={v => `${formatAmount(v)} ${quote.symbol}`}
      />
    );
  }
}

class ForexProductDetailsView extends Component {
  render() {
    const { base, quote, periodIndex, periods } = this.props;
    const ticker = TickerService.getForexTicker(base.symbol);

    if (!ticker || !ticker.history) return null;

    const period = ProductDetailsScreen.periods[periodIndex].toLowerCase();
    const history = ticker.history[period];
    const { changePrice, changePercent, dayAverage } = detailsFromTicker(
      ticker
    );
    const infolist = [
      {
        key: 'price',
        left: 'Price',
        right: formatMoney(ticker.price)
      },
      {
        key: '24hrprice',
        left: '24 Hour Price Average',
        right: formatMoney(dayAverage)
      },
      {
        key: '24hrpricechange',
        left: '24 Hour Price Change',
        right:
          ticker.daymax !== null
            ? `${changePrice < 0 ? '-' : ''}${formatMoney(
                Math.abs(changePrice)
              )} (${formatPercent(changePercent)})`
            : 'N/A',
        rightStyle: getProfitLossStyle(changePercent)
      },
      {
        key: '24hrmax',
        left: '24 Hour Max',
        right: ticker.daymax !== null ? formatMoney(ticker.daymax) : 'N/A'
      },
      {
        key: '24hrmin',
        left: '24 Hour Min',
        right: ticker.daymin !== null ? formatMoney(ticker.daymin) : 'N/A'
      }
    ];

    return (
      <ProductDetailsView
        base={base}
        quote={quote}
        period={period}
        infolist={infolist}
        history={history}
        formatAmount={v => formatMoney(v)}
      />
    );
  }
}

class ProductDetailsScreen extends Component {
  static periods = ['Day', 'Month', 'Year'];

  constructor(props) {
    super(props);

    this.state = {
      period: 2,
      refreshing: false
    };
  }

  async componentDidMount() {
    await this.onRefresh();
  }

  render() {
    const {
      navigation: {
        state: {
          params: {
            product: { base, quote }
          }
        }
      }
    } = this.props;

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
      >
        {this.props.settings.showForexPrices ? (
          <ForexProductDetailsView
            base={base}
            quote={quote}
            periodIndex={this.state.period}
            periods={ProductDetailsScreen.periods}
          />
        ) : (
          <TokenProductDetailsView
            base={base}
            quote={quote}
            periodIndex={this.state.period}
            periods={ProductDetailsScreen.periods}
          />
        )}
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
  container: {
    flex: 1,
    marginTop: 10
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
  right: {
    flex: 1,
    textAlign: 'right',
    marginHorizontal: 10
  }
};

export default connect(
  state => ({
    settings: state.settings
  }),
  dispatch => ({ dispatch })
)(ProductDetailsScreen);
