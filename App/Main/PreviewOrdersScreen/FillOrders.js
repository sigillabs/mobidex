import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { getProfitLossStyle } from '../../../styles';
import { loadOrders } from '../../../thunks';
import { formatAmount, formatAmountWithDecimals } from '../../../utils';
import Button from '../../components/Button';
import TwoColumnListItem from '../../components/TwoColumnListItem';
import Row from '../../components/Row';
import NavigationService from '../../services/NavigationService';
import {
  convertZeroExOrderToLimitOrder,
  fillOrders
} from '../../services/OrderService';
import { getBalanceByAddress } from '../../services/WalletService';

class Order extends Component {
  render() {
    const { limitOrder, base, quote, highlight, ...rest } = this.props;
    const { amount, price } = limitOrder;

    return (
      <ListItem
        checkmark={highlight}
        title={
          <Row style={[{ flex: 1 }]}>
            <Text>
              {formatAmount(amount)} {base.symbol}
            </Text>
            <Text> </Text>
            <Text>
              {formatAmount(price)} {quote.symbol}
            </Text>
          </Row>
        }
        bottomDivider
        {...rest}
      />
    );
  }
}

Order.propTypes = {
  limitOrder: PropTypes.object.isRequired,
  base: PropTypes.object.isRequired,
  quote: PropTypes.object.isRequired,
  highlight: PropTypes.bool
};

class PreviewFillOrders extends Component {
  UNSAFE_componentWillMount() {
    const {
      navigation: {
        state: {
          params: { side }
        }
      }
    } = this.props;

    if (side !== 'buy' && side !== 'sell') {
      return NavigationService.goBack();
    }
  }

  componentDidMount() {
    this.props.dispatch(loadOrders());
  }

  render() {
    const {
      navigation: {
        state: {
          params: {
            product: { quote, base },
            orders,
            side
          }
        }
      }
    } = this.props;

    const { priceAverage, subtotal, fee, total } = this.getReceipt();

    return (
      <View style={{ flex: 1, marginTop: 50 }}>
        <TwoColumnListItem
          left="Average Price"
          leftStyle={{ height: 30 }}
          right={formatAmount(priceAverage)}
          rightStyle={{ height: 30 }}
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Sub-Total"
          leftStyle={{ height: 30 }}
          right={formatAmount(subtotal.toNumber())}
          rightStyle={{ height: 30 }}
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Fee"
          leftStyle={{ height: 30 }}
          right={formatAmount(fee.toNumber())}
          rightStyle={{ height: 30 }}
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Total"
          leftStyle={{ height: 30 }}
          right={formatAmount(total.toNumber())}
          rightStyle={[getProfitLossStyle(total.toNumber()), { height: 30 }]}
          rowStyle={{ marginTop: 10 }}
          bottomDivider={true}
          topDivider={true}
        />
        <TwoColumnListItem
          left="Funds Available"
          leftStyle={{ height: 30 }}
          right={`${formatAmountWithDecimals(
            getBalanceByAddress(quote.address),
            quote.decimals
          )} ${quote.symbol}`}
          rightStyle={{ height: 30 }}
          rowStyle={{ marginTop: 10 }}
          bottomDivider={true}
        />
        <Button
          large
          onPress={() => this.submit()}
          title={this.getButtonTitle()}
        />
        {orders.map((o, i) => (
          <Order
            key={o.orderHash || o.hash || i}
            limitOrder={convertZeroExOrderToLimitOrder(o, side)}
            base={base}
            quote={quote}
            highlight={true}
          />
        ))}
      </View>
    );
  }

  getButtonTitle() {
    switch (this.props.navigation.state.params.side) {
      case 'buy':
        return 'Confirm Buy';

      case 'sell':
        return 'Confirm Sell';

      default:
        return null;
    }
  }

  getMakerToken() {
    const {
      navigation: {
        state: {
          params: {
            product: { quote, base },
            side
          }
        }
      }
    } = this.props;

    if (side === 'buy') {
      return quote;
    } else if (side === 'sell') {
      return base;
    } else {
      return null;
    }
  }

  getTakerToken() {
    const {
      navigation: {
        state: {
          params: {
            product: { quote, base },
            side
          }
        }
      }
    } = this.props;

    if (side === 'buy') {
      return base;
    } else if (side === 'sell') {
      return quote;
    } else {
      return null;
    }
  }

  getReceipt() {
    const { side, amount } = this.props.navigation.state.params;
    const priceAverage = this.getPriceAverage();

    let subtotal = new BigNumber(amount).mul(priceAverage);
    let fee = new BigNumber(0).negated();
    let total = subtotal.add(fee);

    if (side === 'buy') {
      subtotal = subtotal.negated();
      total = total.negated();
    }

    return {
      priceAverage,
      subtotal,
      fee,
      total
    };
  }

  getPriceAverage() {
    const { side, orders } = this.props.navigation.state.params;

    if (orders.length === 0) {
      return 0;
    }

    let average = null;

    switch (side) {
      case 'buy':
        average = orders.reduce(
          (s, o) =>
            s.add(
              new BigNumber(o.takerTokenAmount)
                .div(o.makerTokenAmount)
                .div(orders.length)
            ),
          new BigNumber(0)
        );
        break;

      case 'sell':
        average = orders.reduce(
          (s, o) =>
            s.add(
              new BigNumber(o.makerTokenAmount)
                .div(o.takerTokenAmount)
                .div(orders.length)
            ),
          new BigNumber(0)
        );
        break;
    }

    return average.toNumber();
  }

  submit() {
    let {
      navigation: {
        state: {
          params: { amount, orders }
        }
      }
    } = this.props;
    const fillAmount = new BigNumber(amount);

    fillOrders(orders, fillAmount);
    NavigationService.navigate('List');
  }
}

PreviewFillOrders.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        side: PropTypes.string.isRequired,
        amount: PropTypes.string.isRequired,
        fee: PropTypes.string.isRequired,
        orders: PropTypes.arrayOf(PropTypes.object).isRequired,
        product: PropTypes.shape({
          base: PropTypes.object.isRequired,
          quote: PropTypes.object.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }).isRequired
};

export default connect(() => ({}), dispatch => ({ dispatch }))(
  PreviewFillOrders
);
