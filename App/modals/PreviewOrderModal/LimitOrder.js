import { BigNumber } from '0x.js';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { InteractionManager, SafeAreaView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import { connect as connectNavigation } from '../../../navigation';
import { getFeeAsset, getQuoteAsset } from '../../../services/AssetService';
import {
  configureOrder,
  convertZeroExOrderToLimitOrder
} from '../../../services/OrderService';
import * as WalletService from '../../../services/WalletService';
import { colors, getProfitLossStyle } from '../../../styles';
import { ActionErrorSuccessFlow, submitOrder } from '../../../thunks';
import { navigationProp } from '../../../types/props';
import Button from '../../components/Button';
import TwoColumnListItem from '../../components/TwoColumnListItem';
import FormattedTokenAmount from '../../components/FormattedTokenAmount';
import Row from '../../components/Row';
import Loading from './Loading';

class PreviewLimitOrder extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      side: PropTypes.string.isRequired,
      base: PropTypes.object.isRequired,
      order: PropTypes.object.isRequired,
      dispatch: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      submitting: false,
      loading: true,
      configuredOrder: null
    };
  }

  componentDidMount() {
    const { side } = this.props;

    this.setState({ loading: true });

    if (side !== 'buy' && side !== 'sell') {
      return this.props.navigation.dismissModal();
    }

    InteractionManager.runAfterInteractions(async () => {
      try {
        const configuredOrder = await configureOrder(this.props.order);
        this.setState({ configuredOrder });
      } catch (err) {
        this.props.navigation.dismissModal();
        this.props.navigation.waitForDisappear(() =>
          this.props.navigation.showErrorModal(err)
        );
      } finally {
        this.setState({ loading: false });
      }
    });
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    const { side } = this.props;

    if (side !== 'buy' && side !== 'sell') {
      return null;
    }

    const receipt = this.getReceipt();

    if (!receipt) return this.props.navigation.dismissModal();

    const { amount, fee, payment, price } = receipt;
    const quoteAsset = getQuoteAsset();
    const baseAsset = this.props.base;
    const feeAsset = getFeeAsset();
    const funds = WalletService.getBalanceByAddress(quoteAsset.address);
    const feeFunds = WalletService.getBalanceByAddress(feeAsset.address);
    const fundsAfterOrder =
      side === 'buy' ? funds.sub(payment) : funds.add(payment);
    const feeFundsAfterOrder = feeFunds.sub(fee);

    const profitStyle = getProfitLossStyle(
      side === 'buy' ? payment.negated() : payment
    );

    return (
      <SafeAreaView
        style={{ width: '100%', height: '100%', flex: 1, marginTop: 50 }}
      >
        <TwoColumnListItem
          left="Amount"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={amount}
              assetData={baseAsset.assetData}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Price"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={price}
              assetData={quoteAsset.assetData}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Payment Amount"
          right={
            <FormattedTokenAmount
              amount={payment}
              assetData={quoteAsset.assetData}
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
              assetData={feeAsset.assetData}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={true}
          leftStyle={{ height: 30 }}
        />
        <TwoColumnListItem
          left="Funds Available"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={funds}
              assetData={quoteAsset.assetData}
              style={[styles.tokenAmountRight]}
            />
          }
          rowStyle={{ marginTop: 10 }}
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Fee Funds Available"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={feeFunds}
              assetData={feeAsset.assetData}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={true}
        />
        <TwoColumnListItem
          left="Funds After Order"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={fundsAfterOrder}
              assetData={quoteAsset.assetData}
              style={[styles.tokenAmountRight, profitStyle]}
            />
          }
          rowStyle={{ marginTop: 10 }}
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Fee Funds After Order"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={feeFundsAfterOrder}
              assetData={feeAsset.assetData}
              style={[
                styles.tokenAmountRight,
                getProfitLossStyle(fee.gt(0) ? -1 : 0)
              ]}
            />
          }
          bottomDivider={true}
        />
        <Row style={{ width: '100%' }}>
          <Button
            large
            onPress={this.cancel}
            title={'Cancel'}
            containerStyle={{ flex: 1 }}
          />
          <Button
            large
            onPress={this.submit}
            title={this.getButtonTitle()}
            containerStyle={{ flex: 1 }}
          />
        </Row>
      </SafeAreaView>
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
    const { side } = this.props;
    const { configuredOrder } = this.state;

    const limitOrder = convertZeroExOrderToLimitOrder(configuredOrder, side);

    if (!limitOrder) return null;

    const feeAsset = getFeeAsset();
    const fee = Web3Wrapper.toUnitAmount(
      new BigNumber(configuredOrder.makerFee),
      feeAsset.decimals
    );

    let payment = new BigNumber(limitOrder.amount).mul(limitOrder.price);

    return {
      amount: limitOrder.amount,
      fee,
      payment,
      price: limitOrder.price
    };
  }

  submit = async () => {
    const { configuredOrder } = this.state;

    this.props.dispatch(
      ActionErrorSuccessFlow(
        this.props.navigation.componentId,
        {
          action: async () =>
            await this.props.dispatch(submitOrder(configuredOrder)),
          icon: <Entypo name="chevron-with-circle-up" size={100} />,
          label: 'Creating Order...'
        },
        'Created Order',
        () => this.props.navigation.dismissModal()
      )
    );
  };

  cancel = () => this.props.navigation.dismissModal();
}

export default connect(
  () => ({}),
  dispatch => ({ dispatch })
)(connectNavigation(PreviewLimitOrder));

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
