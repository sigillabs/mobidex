import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { ZERO } from '../../../constants/0x';
import { connect as connectNavigation } from '../../../navigation';
import {
  convertZeroExOrderToLimitOrder
} from '../../../services/OrderService';
import { getAdjustedBalanceByAddress } from '../../../services/WalletService';
import { colors, getProfitLossStyle } from '../../../styles';
import { submitOrder } from '../../../thunks';
import Button from '../../components/Button';
import TwoColumnListItem from '../../components/TwoColumnListItem';
import FormattedTokenAmount from '../../components/FormattedTokenAmount';
import { getQuoteAsset } from '../../../services/AssetService';
import SubmittingOrders from './SubmittingOrders';

class PreviewLimitOrder extends Component {
  static get propTypes() {
    return {
      side: PropTypes.string.isRequired,
      base: PropTypes.object.isRequired,
      order: PropTypes.object.isRequired,
      dispatch: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      submitting: false
    };
  }

  componentDidMount() {
    const { side } = this.props;

    if (side !== 'buy' && side !== 'sell') {
      return this.props.navigation.dismissModal();
    }
  }

  render() {
    if (this.state.submitting) {
      return <SubmittingOrders text={'Creating Order'} />;
    }

    const { side } = this.props;

    if (side !== 'buy' && side !== 'sell') {
      return null;
    }

    const quoteToken = getQuoteAsset();
    const receipt = this.getReceipt();

    if (!receipt) return this.props.navigation.dismissModal();

    const { subtotal, fee, total } = receipt;
    const funds = getAdjustedBalanceByAddress(quoteToken.address);
    const fundsAfterOrder = funds.add(total);

    return (
      <View style={{ width: '100%', height: '100%', flex: 1, marginTop: 50 }}>
        <TwoColumnListItem
          left="Sub-Total"
          right={
            <FormattedTokenAmount
              amount={subtotal}
              symbol={quoteToken.symbol}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={false}
          leftStyle={[styles.tokenAmountLeft]}
        />
        <TwoColumnListItem
          left="Fee"
          right={
            <FormattedTokenAmount
              amount={fee}
              symbol={quoteToken.symbol}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={false}
          leftStyle={{ height: 30 }}
        />
        <TwoColumnListItem
          left="Total"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={total}
              symbol={quoteToken.symbol}
              style={[styles.tokenAmountRight, getProfitLossStyle(total)]}
            />
          }
          rowStyle={{ marginTop: 10 }}
          topDivider={true}
          bottomDivider={true}
        />
        <TwoColumnListItem
          left="Funds Available"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={funds}
              symbol={quoteToken.symbol}
              style={[styles.tokenAmountRight]}
            />
          }
          rowStyle={{ marginTop: 10 }}
          bottomDivider={true}
        />
        <TwoColumnListItem
          left="Funds After Order"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={fundsAfterOrder}
              symbol={quoteToken.symbol}
              style={[styles.tokenAmountRight, getProfitLossStyle(total)]}
            />
          }
          rowStyle={{ marginTop: 10 }}
          bottomDivider={true}
        />
        <Button
          large
          onPress={() => this.submit()}
          title={this.getButtonTitle()}
        />
      </View>
    );
  }

  getButtonTitle() {
    const { side } = this.props;

    switch (side) {
      case 'buy':
        return 'Confirm Buy Order';

      case 'sell':
        return 'Confirm Sell Order';

      default:
        return null;
    }
  }

  getReceipt() {
    const { order, side } = this.props;

    const limitOrder = convertZeroExOrderToLimitOrder(order, side);

    if (!limitOrder) return null;

    let subtotal = new BigNumber(limitOrder.amount).mul(limitOrder.price);
    let fee = ZERO;
    let total = subtotal.add(fee);

    if (side === 'buy') {
      subtotal = subtotal.negated();
      total = total.negated();
    }

    return {
      subtotal,
      fee,
      total
    };
  }

  async submit() {
    const { order } = this.props;

    this.setState({ submitting: true });

    try {
      await this.props.dispatch(submitOrder(order));
      this.props.navigation.dismissModal();
    } catch (err) {
      this.props.navigation.showErrorModal(err);
    } finally {
      this.setState({ submitting: false });
    }
  }
}

export default connect(() => ({}), dispatch => ({ dispatch }))(
  connectNavigation(PreviewLimitOrder)
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
