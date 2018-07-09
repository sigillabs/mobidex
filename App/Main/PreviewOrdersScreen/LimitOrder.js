import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import { colors, getProfitLossStyle } from '../../../styles';
import { formatAmount, formatAmountWithDecimals } from '../../../utils';
import Button from '../../components/Button';
import TwoColumnListItem from '../../components/TwoColumnListItem';
import NavigationService from '../../services/NavigationService';
import {
  convertZeroExOrderToLimitOrder,
  signOrder,
  submitOrder
} from '../../services/OrderService';
import { getQuoteToken } from '../../services/TokenService';
import { getBalanceByAddress } from '../../services/WalletService';
import Loading from './Loading';

class PreviewLimitOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCreating: false
    };
  }

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

  render() {
    if (this.state.showCreating) {
      return <Loading text={'Creating limit order'} />;
    }

    const quoteToken = getQuoteToken();
    const receipt = this.getReceipt();

    if (!receipt) return NavigationService.goBack();

    const { subtotal, fee, total } = receipt;
    const quoteBalance = getBalanceByAddress(quoteToken.address);

    return (
      <View style={{ width: '100%', height: '100%', flex: 1, marginTop: 50 }}>
        <TwoColumnListItem
          left="Sub-Total"
          right={formatAmount(subtotal.toNumber())}
          bottomDivider={false}
          leftStyle={{
            color: colors.primary,
            height: 30
          }}
          rightStyle={{
            color: colors.primary,
            height: 30
          }}
        />
        <TwoColumnListItem
          left="Fee"
          right={formatAmount(fee.toNumber())}
          bottomDivider={false}
          leftStyle={{ color: colors.primary, height: 30 }}
          rightStyle={{ color: colors.primary, height: 30 }}
        />
        <TwoColumnListItem
          left="Total"
          leftStyle={{ height: 30 }}
          right={formatAmount(total.toNumber())}
          rightStyle={[getProfitLossStyle(total.toNumber()), { height: 30 }]}
          rowStyle={{ marginTop: 10 }}
          topDivider={true}
          bottomDivider={true}
        />
        <TwoColumnListItem
          left="Funds Available"
          leftStyle={{ height: 30 }}
          right={`${formatAmountWithDecimals(
            quoteBalance,
            quoteToken.decimals
          )} ${quoteToken.symbol}`}
          rightStyle={{ height: 30 }}
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
    const {
      navigation: {
        state: {
          params: { side }
        }
      }
    } = this.props;

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
    const {
      navigation: {
        state: {
          params: { side, order }
        }
      }
    } = this.props;

    const limitOrder = convertZeroExOrderToLimitOrder(order, side);

    if (!limitOrder) return null;

    let subtotal = new BigNumber(limitOrder.amount).mul(limitOrder.price);
    let fee = new BigNumber(0);
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
    const {
      navigation: {
        state: {
          params: { order }
        }
      }
    } = this.props;

    this.setState({ showCreating: true });

    const signedOrder = await signOrder(order);
    if (!signedOrder) {
      this.setState({ showCreating: false });
      return;
    }

    try {
      await submitOrder(signedOrder);
    } catch (error) {
      NavigationService.error(error);
      return;
    } finally {
      this.setState({ showCreating: false });
    }

    NavigationService.navigate('List');
  }
}

PreviewLimitOrder.propTypes = {
  quoteSymbol: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        side: PropTypes.string.isRequired,
        order: PropTypes.object.isRequired
      }).isRequired
    }).isRequired
  }).isRequired
};

export default connect(
  state => ({
    quoteSymbol: state.settings.quoteSymbol
  }),
  dispatch => ({ dispatch })
)(PreviewLimitOrder);
