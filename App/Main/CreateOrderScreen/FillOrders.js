import { ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import * as _ from 'lodash';
import React, { Component } from 'react';
import { View } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { setError } from '../../../actions';
import { colors, getProfitLossStyle } from '../../../styles';
import { fillUpToBaseAmount, loadOrders } from '../../../thunks';
import {
  calculateAmount,
  calculatePrice,
  filterAndSortOrdersByTokensAndTakerAddress,
  filterOrdersToBaseAmount,
  formatAmount,
  formatAmountWithDecimals
} from '../../../utils';
import Button from '../../components/Button';
import TwoColumnListItem from '../../components/TwoColumnListItem';
import Row from '../../components/Row';
import TokenInput from '../../components/TokenInput';
import LogoTicker from '../../views/LogoTicker';

class Order extends Component {
  render() {
    const { order, base, quote, highlight, ...rest } = this.props;
    const amount = calculateAmount(order, quote, base);
    const price = calculatePrice(order, quote, base);
    const side = order.makerTokenAddress === base.address ? 'buy' : 'sell';

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

class FillOrders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: new BigNumber(0),
      amountError: false
    };
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
            side
          }
        }
      },
      orders
    } = this.props;

    const otherSide = side == 'buy' ? 'sell' : 'buy';
    const baseAmount = ZeroEx.toBaseUnitAmount(
      this.state.amount,
      base.decimals
    );
    const baseAsset = _.find(this.props.asset, { address: base.address });
    const priceAverage = this.getPriceAverage();
    const fillableOrders = filterAndSortOrdersByTokensAndTakerAddress(
      orders,
      base,
      quote,
      otherSide
    );
    const ordersToFill = this.state.amount.gt(0)
      ? filterOrdersToBaseAmount(baseAmount, fillableOrders, side)
      : [];

    let label = null;
    let buttonLabel = null;
    let subTotal = new BigNumber(this.state.amount).mul(priceAverage);
    let fee = new BigNumber(0).negated();
    let total = subTotal.add(fee);

    if (side === 'buy') {
      subTotal = subTotal.negated();
      total = total.negated();
    }

    switch (side) {
      case 'buy':
        label = 'Buying';
        buttonLabel = 'Confirm Buy';
        break;

      case 'sell':
        label = 'Selling';
        buttonLabel = 'Confirm Sell';
        break;

      default:
        this.props.dispatch(
          setError(
            new Error(`Order side ${side} is not supported by Mobidex yet!`)
          )
        );
        return null;
    }

    return (
      <View>
        <LogoTicker token={base} />
        <TokenInput
          label={label}
          token={base}
          containerStyle={{ marginTop: 10, marginBottom: 10, padding: 0 }}
          onChange={value => this.onSetAmount(value)}
          amount={this.state.amount}
        />
        <TwoColumnListItem
          left="Average Price"
          right={formatAmount(priceAverage)}
          bottomDivider={false}
          leftStyle={{ fontSize: 10, color: colors.grey3 }}
          rightStyle={{ fontSize: 10, color: colors.grey3 }}
        />
        <TwoColumnListItem
          left="Sub-Total"
          right={formatAmount(subTotal.toNumber())}
          bottomDivider={false}
          leftStyle={{ fontSize: 10, color: colors.grey3 }}
          rightStyle={{ fontSize: 10, color: colors.grey3 }}
        />
        <TwoColumnListItem
          left="Fee"
          right={formatAmount(fee.toNumber())}
          bottomDivider={false}
          leftStyle={{ fontSize: 10, color: colors.grey3 }}
          rightStyle={{ fontSize: 10, color: colors.grey3 }}
        />
        <TwoColumnListItem
          left="Holding"
          right={
            baseAsset
              ? formatAmountWithDecimals(baseAsset.balance, baseAsset.decimals)
              : 0
          }
          topDivider={true}
          bottomDivider={true}
        />
        <TwoColumnListItem
          left="Total"
          right={formatAmount(total.toNumber())}
          rightStyle={getProfitLossStyle(total.toNumber())}
          bottomDivider={true}
        />
        <Button large onPress={() => this.submit()} title={buttonLabel} />
        {fillableOrders.map((o, i) => (
          <Order
            key={o.orderHash || o.hash || i}
            order={o}
            base={base}
            quote={quote}
            highlight={Boolean(_.find(ordersToFill, o))}
          />
        ))}
      </View>
    );
  }

  getBaseAmount() {
    return ZeroEx.toBaseUnitAmount(
      this.state.amount,
      this.props.navigation.state.params.product.base.decimals
    );
  }

  getPriceAverage() {
    const { side } = this.props.navigation.state.params;
    const otherSide = side === 'buy' ? 'sell' : 'buy';
    const fillableOrders = filterAndSortOrdersByTokensAndTakerAddress(
      this.props.orders,
      this.props.navigation.state.params.product.base,
      this.props.navigation.state.params.product.quote,
      otherSide
    );
    const ordersToFill = filterOrdersToBaseAmount(
      this.getBaseAmount(),
      fillableOrders,
      side
    );

    if (ordersToFill.length === 0) {
      return 0;
    }

    let average = null;
    switch (side) {
      case 'buy':
        average = ordersToFill.reduce(
          (s, o) =>
            s.add(
              new BigNumber(o.takerTokenAmount)
                .div(o.makerTokenAmount)
                .div(ordersToFill.length)
            ),
          new BigNumber(0)
        );
        break;

      case 'sell':
        average = ordersToFill.reduce(
          (s, o) =>
            s.add(
              new BigNumber(o.makerTokenAmount)
                .div(o.takerTokenAmount)
                .div(ordersToFill.length)
            ),
          new BigNumber(0)
        );
        break;
    }

    return average.toNumber();
  }

  onSetAmount(value) {
    try {
      let amount = new BigNumber(value.replace(/,/g, ''));
      if (amount.gt(0)) {
        this.setState({ amount: amount, amountError: false });
      } else {
        this.setState({ amount: new BigNumber(0), amountError: true });
      }
    } catch (err) {
      this.setState({ amount: new BigNumber(0), amountError: true });
    }
  }

  submit() {
    let {
      navigation: {
        state: {
          params: {
            product: { quote, base },
            side
          }
        }
      }
    } = this.props;
    const otherSide = side === 'buy' ? 'sell' : 'buy';
    const { amount, price } = this.state;
    const baseAmount =
      side === 'buy'
        ? ZeroEx.toBaseUnitAmount(
            new BigNumber(amount || 0).mul(price || 0),
            quote.decimals
          )
        : ZeroEx.toBaseUnitAmount(new BigNumber(amount || 0), base.decimals);

    this.props.dispatch(fillUpToBaseAmount(baseAmount, base, quote, otherSide));
    this.props.navigation.push('List');
  }
}

export default connect(
  (state, ownProps) => ({
    ...state.device,
    ...state.relayer,
    ...state.settings,
    ...state.wallet,
    ...ownProps
  }),
  dispatch => ({ dispatch })
)(FillOrders);
