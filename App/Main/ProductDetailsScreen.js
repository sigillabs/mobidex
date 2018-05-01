import * as _ from 'lodash';
import React, { Component } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import {
  Button,
  Card,
  Header,
  Icon,
  ListItem,
  Text
} from 'react-native-elements';
import { connect } from 'react-redux';
import { updateForexTickers, updateTokenTickers } from '../../thunks';
import {
  detailsFromTicker,
  history as fetchHistory,
  formatMoney,
  formatPercent,
  getPriceChangeFromTicker
} from '../../utils';
import ButtonGroup from '../components/ButtonGroup';
import SmallLogo from '../components/SmallLogo';
import LongButton from '../components/LongButton';
import Row from '../components/Row';
import PriceGraph from '../views/PriceGraph';

class ProductDetailsView extends Component {
  render() {
    const {
      token,
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
        title: 'Price',
        subtitle: formatMoney(forexTicker.price)
      },
      {
        title: '24 Hour Price Average',
        subtitle: formatMoney(dayAverage)
      },
      {
        title: '24 Hour Price Change',
        subtitle: `${changePrice < 0 ? '-' : ''}${formatMoney(
          Math.abs(changePrice)
        )} (${formatPercent(changePercent)})`
      },
      {
        title: '24 Hour Max',
        subtitle: formatMoney(forexTicker.daymax)
      },
      {
        title: '24 Hour Min',
        subtitle: formatMoney(forexTicker.daymin)
      }
    ];

    return (
      <View style={[styles.container]}>
        <SmallLogo
          avatarProps={{ medium: true }}
          symbol={token.symbol}
          title={formatMoney(forexTicker.price)}
          subtitle={formatPercent(changePercent)}
          titleStyle={{ fontSize: 24 }}
          subtitleStyle={{ fontSize: 14 }}
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
        />
        <LongButton
          large
          icon={<Icon name="send" size={20} color="white" />}
          onPress={() => this.props.navigation.push('CreateOrder')}
          title="Buy/Sell"
        />
        {infolist.map(({ title, subtitle }) => (
          <ListItem title={title} subtitle={subtitle} chevron={false} />
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
    const token = this.getToken('base');
    const quoteToken = this.getToken('quote');

    const proceed =
      token &&
      forexTickers[token.symbol] &&
      forexTickers[token.symbol][forexCurrency] &&
      tokenTickers[token.symbol] &&
      tokenTickers[token.symbol][quoteToken.symbol];

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
            token={token}
            forexTicker={forexTickers[token.symbol][forexCurrency]}
            tokenTicker={tokenTickers[token.symbol][quoteToken.symbol]}
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
