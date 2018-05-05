import * as _ from 'lodash';
import React, { Component } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Card, Header, Icon, ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
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
import SmallLogo from '../components/SmallLogo';
import Row from '../components/Row';
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
        left: 'Price',
        right: formatMoney(forexTicker.price)
      },
      {
        left: '24 Hour Price Average',
        right: formatMoney(dayAverage)
      },
      {
        left: '24 Hour Price Change',
        right: `${changePrice < 0 ? '-' : ''}${formatMoney(
          Math.abs(changePrice)
        )} (${formatPercent(changePercent)})`,
        rightStyle: changePercent >= 0 ? styles.profit : styles.loss
      },
      {
        left: '24 Hour Max',
        right: formatMoney(forexTicker.daymax)
      },
      {
        left: '24 Hour Min',
        right: formatMoney(forexTicker.daymin)
      }
    ];

    return (
      <View style={[styles.container]}>
        <SmallLogo
          avatarProps={{ medium: true }}
          symbol={base.symbol}
          title={formatMoney(forexTicker.price)}
          subtitle={formatPercent(changePercent)}
          titleStyle={{ fontSize: 24 }}
          subtitleStyle={[
            { fontSize: 14 },
            changePercent >= 0 ? styles.profit : styles.loss
          ]}
        />
        <PriceGraph
          interval={period}
          height={200}
          containerStyle={{ margin: 15 }}
          data={history}
        />
        <ButtonGroup
          onPress={onChoosePeriod}
          selectedIndex={periodIndex}
          buttons={periods}
          innerBorderStyle={{ width: -1 }}
          containerStyle={{ width: 140, alignSelf: 'center' }}
        />
        <Button
          large
          icon={<Icon name="send" size={20} color="white" />}
          onPress={() =>
            this.props.navigation.push('CreateOrder', {
              product: { base, quote }
            })
          }
          title="Buy/Sell"
          containerStyle={{ width: 150, alignSelf: 'center' }}
        />
        {infolist.map(({ left, right, leftStyle, rightStyle }) => (
          <ProductDetailListItem
            left={left}
            right={right}
            leftStyle={leftStyle}
            rightStyle={rightStyle}
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
      period: 0,
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
    margin: 10
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
    ...state.wallet,
    ...state.device.layout,
    ...state.settings,
    ticker: state.ticker
  }),
  dispatch => ({ dispatch })
)(ProductDetailsScreen);
