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
import { formatAmount } from '../../../utils';
import { navigationProp } from '../../../types/props';
import Button from '../../components/Button';
import Row from '../../components/Row';
import Receipt from '../../views/Receipt';
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

    const { amount, relayerFee, payment, price } = receipt;
    const quoteAsset = getQuoteAsset();
    const baseAsset = this.props.base;
    const relayerFeeAsset = getFeeAsset();
    const quoteFunds = WalletService.getBalanceByAddress(quoteAsset.address);
    const baseFunds = WalletService.getBalanceByAddress(baseAsset.address);
    const relayerFeeFunds = WalletService.getBalanceByAddress(
      relayerFeeAsset.address
    );
    const quoteFundsAfterOrder =
      side === 'buy' ? quoteFunds.sub(payment) : quoteFunds.add(payment);
    const baseFundsAfterOrder =
      side === 'buy' ? baseFunds.add(payment) : baseFunds.sub(payment);
    const relayerFeeFundsAfterOrder = relayerFeeFunds.sub(relayerFee);

    const profitStyle = getProfitLossStyle(
      side === 'buy' ? payment.negated() : payment
    );

    const extraWalletData = [
      {
        denomination: quoteAsset.symbol,
        value: formatAmount(quoteFunds, 9)
      },
      {
        denomination: baseAsset.symbol,
        value: formatAmount(baseFunds, 9)
      },
      {
        denomination: relayerFeeAsset.symbol,
        value: formatAmount(relayerFeeFunds, 9)
      }
    ];
    const extraUpdatedWalletData = [
      {
        denomination: quoteAsset.symbol,
        value: formatAmount(quoteFundsAfterOrder, 9),
        profit: side === 'sell',
        loss: side === 'buy'
      },
      {
        denomination: baseAsset.symbol,
        value: formatAmount(baseFundsAfterOrder, 9),
        profit: side === 'buy',
        loss: side === 'sell'
      },
      {
        denomination: relayerFeeAsset.symbol,
        value: formatAmount(relayerFeeFundsAfterOrder, 9),
        loss: relayerFee.gt(0)
      }
    ];
    const extraSections = [
      {
        title: 'Relayer',
        data: [
          {
            name: 'Fees',
            value: formatAmount(relayerFee, 9),
            denomination: relayerFeeAsset.symbol,
            loss: relayerFee.gt(0)
          }
        ]
      },
      {
        title: 'Order',
        data: [
          {
            name: 'Side',
            value: side
          },
          {
            name: 'Price',
            value: formatAmount(price, 9),
            denomination: quoteAsset.symbol
          },
          {
            name: 'Sending',
            value: formatAmount(side === 'buy' ? payment : amount, 9),
            denomination: side === 'buy' ? quoteAsset.symbol : baseAsset.symbol,
            loss: true
          },
          {
            name: 'Receiving',
            value: formatAmount(side === 'buy' ? amount : payment, 9),
            denomination: side === 'buy' ? baseAsset.symbol : quoteAsset.symbol,
            profit: true
          }
        ]
      }
    ];

    return (
      <SafeAreaView style={[styles.flex1]}>
        <Receipt
          extraWalletData={extraWalletData}
          extraUpdatedWalletData={extraUpdatedWalletData}
          extraSections={extraSections}
          showNetwork={false}
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

    const relayerFeeAsset = getFeeAsset();
    const relayerFee = Web3Wrapper.toUnitAmount(
      new BigNumber(configuredOrder.makerFee),
      relayerFeeAsset.decimals
    );

    let payment = new BigNumber(limitOrder.amount).mul(limitOrder.price);

    return {
      amount: limitOrder.amount,
      relayerFee,
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
