import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import NavigationService from '../../../../services/NavigationService';
import * as OrderService from '../../../../services/OrderService';
import { getAdjustedBalanceByAddress } from '../../../../services/WalletService';
import { colors, getProfitLossStyle } from '../../../../styles';
import Button from '../../../components/Button';
import TwoColumnListItem from '../../../components/TwoColumnListItem';
import FormattedTokenAmount from '../../../components/FormattedTokenAmount';
import Row from '../../../components/Row';
import Loading from '../Loading';

class Order extends Component {
  render() {
    const { limitOrder, base, quote, highlight, ...rest } = this.props;
    const { amount, price } = limitOrder;

    return (
      <ListItem
        checkmark={highlight}
        title={
          <Row style={[{ flex: 1 }]}>
            <FormattedTokenAmount amount={amount} symbol={base.symbol} />
            <Text> priced at </Text>
            <FormattedTokenAmount amount={price} symbol={quote.symbol} />
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

class BasePreviewFillOrders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showFilling: false
    };
  }

  render() {
    if (this.state.showFilling) {
      return <Loading text={'Filling orders'} />;
    }

    const receipt = this.getReceipt();

    if (!receipt) return null;

    const { baseToken, buttonTitle, orders, quoteToken } = this.props;

    const { priceAverage, subtotal, fee, total } = receipt;
    const funds = getAdjustedBalanceByAddress(quoteToken.address);
    const fundsAfterOrder = funds.add(total);

    return (
      <View style={{ width: '100%', height: '100%', flex: 1, marginTop: 50 }}>
        <TwoColumnListItem
          left="Average Price"
          leftStyle={{ height: 30 }}
          right={
            <FormattedTokenAmount
              amount={priceAverage}
              symbol={quoteToken.symbol}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Sub-Total"
          leftStyle={{ height: 30 }}
          right={
            <FormattedTokenAmount
              amount={subtotal}
              symbol={quoteToken.symbol}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Fee"
          leftStyle={{ height: 30 }}
          right={
            <FormattedTokenAmount
              amount={fee}
              symbol={quoteToken.symbol}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Total"
          leftStyle={{ height: 30 }}
          right={
            <FormattedTokenAmount
              amount={total}
              symbol={quoteToken.symbol}
              style={[
                styles.tokenAmountRight,
                getProfitLossStyle(total.toNumber())
              ]}
            />
          }
          rowStyle={{ marginTop: 10 }}
          bottomDivider={true}
          topDivider={true}
        />
        <TwoColumnListItem
          left="Funds Available"
          leftStyle={{ height: 30 }}
          right={
            <FormattedTokenAmount
              amount={funds}
              symbol={quoteToken.symbol}
              style={[styles.tokenAmountRight]}
            />
          }
          rightStyle={{ height: 30 }}
          rowStyle={{ marginTop: 10 }}
          bottomDivider={true}
        />

        <TwoColumnListItem
          left="Funds After Filling Orders"
          leftStyle={{ height: 30 }}
          right={
            <FormattedTokenAmount
              amount={fundsAfterOrder}
              symbol={quoteToken.symbol}
              style={[
                styles.tokenAmountRight,
                getProfitLossStyle(total.toNumber())
              ]}
            />
          }
          rightStyle={{ height: 30 }}
          rowStyle={{ marginTop: 10 }}
          bottomDivider={true}
        />
        <Button large onPress={() => this.submit()} title={buttonTitle} />
        {orders.map((o, i) => (
          <Order
            key={o.orderHash || o.hash || i}
            limitOrder={OrderService.convertZeroExOrderToLimitOrder(o)}
            base={baseToken}
            quote={quoteToken}
            highlight={true}
          />
        ))}
      </View>
    );
  }

  getReceipt() {
    const { amount, baseToken, quoteToken, orders } = this.props;
    const priceAverage = OrderService.getAveragePrice(orders);
    const subtotal = this.props.getSubtotal(baseToken, quoteToken, amount);
    const fee = this.props.getTotalFee(baseToken, quoteToken, amount);
    const total = this.props.getTotal(baseToken, quoteToken, amount);

    return {
      priceAverage,
      subtotal,
      fee,
      total
    };
  }

  async submit() {
    const { amount, baseToken, quoteToken, fillAction } = this.props;
    const fillAmount = new BigNumber(amount);
    const baseUnitFillAmount = this.props.toBaseUnitAmount(
      baseToken,
      quoteToken,
      fillAmount
    );

    this.setState({ showFilling: true });
    this.props.hideHeader();

    try {
      await this.props.dispatch(
        fillAction(
          `${baseToken.symbol}-${quoteToken.symbol}`,
          baseUnitFillAmount
        )
      );
    } catch (err) {
      NavigationService.error(err);
      return;
    } finally {
      this.setState({ showFilling: false });
      this.props.showHeader();
    }

    NavigationService.navigate('List');
  }
}

BasePreviewFillOrders.propTypes = {
  dispatch: PropTypes.func.isRequired,
  buttonTitle: PropTypes.string.isRequired,
  baseToken: PropTypes.object.isRequired,
  quoteToken: PropTypes.object.isRequired,
  amount: PropTypes.string.isRequired,
  fee: PropTypes.string.isRequired,
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  fillAction: PropTypes.func.isRequired,
  getSubtotal: PropTypes.func.isRequired,
  getTotalFee: PropTypes.func.isRequired,
  getTotal: PropTypes.func.isRequired,
  toBaseUnitAmount: PropTypes.func.isRequired,
  hideHeader: PropTypes.func.isRequired,
  showHeader: PropTypes.func.isRequired
};

export default connect(() => ({}), dispatch => ({ dispatch }))(
  BasePreviewFillOrders
);

const styles = {
  tokenAmountLeft: {
    color: colors.primary,
    height: 30
  },
  tokenAmountRight: {
    flex: 1,
    textAlign: 'right',
    height: 30,
    color: colors.primary
  }
};
