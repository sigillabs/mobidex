import * as _ from 'lodash';
import React, { Component } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Card, Header, Icon, ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { getProfitLossStyle } from '../../styles';
import { updateForexTickers, updateTokenTickers } from '../../thunks';
import {
  detailsFromTicker,
  history as fetchHistory,
  formatMoney,
  formatPercent,
  getPriceChangeFromTicker
} from '../../utils';
import Button from '../components/Button';
import ButtonGroup from '../components/ButtonGroup';
import Divider from '../components/Divider';
import Padding from '../components/Padding';
import Row from '../components/Row';
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
    const {
      base,
      quote,
      forexTicker,
      tokenTicker,
      periodIndex,
      periods,
      onChoosePeriod
    } = this.props;
    const period = ProductDetailsScreen.periods[periodIndex].toLowerCase();
    const history = forexTicker.history[period];
    const { changePrice, changePercent, dayAverage } = detailsFromTicker(
      forexTicker
    );
    const infolist = [
      {
        key: 'price',
        left: 'Price',
        right: formatMoney(forexTicker.price)
      },
      {
        key: '24hrprice',
        left: '24 Hour Price Average',
        right: formatMoney(dayAverage)
      },
      {
        key: '24hrpricechange',
        left: '24 Hour Price Change',
        right: `${changePrice < 0 ? '-' : ''}${formatMoney(
          Math.abs(changePrice)
        )} (${formatPercent(changePercent)})`,
        rightStyle: getProfitLossStyle(changePercent)
      },
      {
        key: '24hrmax',
        left: '24 Hour Max',
        right: formatMoney(forexTicker.daymax)
      },
      {
        key: '24hrmin',
        left: '24 Hour Min',
        right: formatMoney(forexTicker.daymin)
      }
    ];

    return (
      <View style={[styles.container]}>
        <LogoTicker token={base} />
        <Divider style={{ marginBottom: 0 }} />
        <PriceGraph
          interval={period}
          height={200}
          data={history}
          label={'Last 30 Days'}
        />
        <Divider style={{ marginTop: 5 }} />
        {/*<ButtonGroup
          onPress={onChoosePeriod}
          selectedIndex={periodIndex}
          buttons={periods}
          innerBorderStyle={{ width: -1 }}
          containerStyle={{ width: 140, alignSelf: 'center' }}
        />*/}
        <Row style={{ justifyContent: 'center' }}>
          <Button
            large
            icon={<Icon name="send" size={20} color="white" />}
            onPress={() =>
              this.props.navigation.push('CreateOrder', {
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
            icon={<Icon name="send" size={20} color="white" />}
            onPress={() =>
              this.props.navigation.push('CreateOrder', {
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

class ProductDetailsScreen extends Component {
  static periods = ['Day', 'Month'];

  constructor(props) {
    super(props);

    this.state = {
      period: 1,
      refreshing: false
    };
  }

  async componentDidMount() {
    await this.onRefresh();
  }

  render() {
    const { forexCurrency } = this.props;
    const forexTickers = this.props.ticker.forex;
    const tokenTickers = this.props.ticker.token;
    const baseToken = this.getToken('base');
    const quoteToken = this.getToken('quote');

    const proceed =
      baseToken &&
      forexTickers[baseToken.symbol] &&
      forexTickers[baseToken.symbol][forexCurrency] &&
      tokenTickers[baseToken.symbol] &&
      tokenTickers[baseToken.symbol][quoteToken.symbol];

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
      >
        {proceed ? (
          <ProductDetailsView
            navigation={this.props.navigation}
            base={baseToken}
            quote={quoteToken}
            forexTicker={forexTickers[baseToken.symbol][forexCurrency]}
            tokenTicker={tokenTickers[baseToken.symbol][quoteToken.symbol]}
            periodIndex={this.state.period}
            periods={ProductDetailsScreen.periods}
            onChoosePeriod={index => {
              this.setState({
                period: index
              });
            }}
          />
        ) : null}
      </ScrollView>
    );
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.props.dispatch(updateForexTickers());
    await this.props.dispatch(updateTokenTickers());
    this.setState({ refreshing: false });
  };

  getToken = (quoteOrBase = 'base') => {
    let {
      navigation: {
        state: {
          params: {
            product: { tokenA, tokenB }
          }
        }
      }
    } = this.props;

    if (quoteOrBase === 'base') {
      return _.find(this.props.assets, { address: tokenB.address });
    } else {
      return _.find(this.props.assets, { address: tokenA.address });
    }
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
    ...state.wallet,
    ...state.device.layout,
    ...state.settings,
    ticker: state.ticker
  }),
  dispatch => ({ dispatch })
)(ProductDetailsScreen);
