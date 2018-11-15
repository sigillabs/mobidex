import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { ZERO } from '../../../constants/0x';
import { colors, getProfitLossStyle } from '../../../styles';
import { submitOrder } from '../../../thunks';
import Button from '../../components/Button';
import TwoColumnListItem from '../../components/TwoColumnListItem';
import FormattedTokenAmount from '../../components/FormattedTokenAmount';
import { getQuoteAsset } from '../../../services/AssetService';
import NavigationService from '../../../services/NavigationService';
import {
  convertZeroExOrderToLimitOrder,
  signOrder
} from '../../../services/OrderService';
import { getAdjustedBalanceByAddress } from '../../../services/WalletService';

class PreviewLimitOrder extends Component {
  static get propTypes() {
    return {
      quoteSymbol: PropTypes.string.isRequired,
      dispatch: PropTypes.func.isRequired,
      navigation: PropTypes.shape({
        push: PropTypes.func.isRequired,
        setParams: PropTypes.func.isRequired,
        state: PropTypes.shape({
          params: PropTypes.shape({
            side: PropTypes.string.isRequired,
            order: PropTypes.object.isRequired
          }).isRequired
        }).isRequired
      }).isRequired
    };
  }

  componentDidMount() {
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
    const {
      navigation: {
        state: {
          params: { side }
        }
      }
    } = this.props;

    if (side !== 'buy' && side !== 'sell') {
      return null;
    }

    const quoteToken = getQuoteAsset();
    const receipt = this.getReceipt();

    if (!receipt) return NavigationService.goBack();

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
              style={[
                styles.tokenAmountRight,
                getProfitLossStyle(total.toNumber())
              ]}
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
              style={[
                styles.tokenAmountRight,
                getProfitLossStyle(total.toNumber())
              ]}
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
    const {
      navigation: {
        state: {
          params: { order }
        }
      }
    } = this.props;

    NavigationService.navigate('SubmittingOrders', {
      action: async () => {
        const signedOrder = await signOrder(order);
        if (!signedOrder) {
          throw new Error('Order could not be signed.');
        }
        await this.props.dispatch(submitOrder(signedOrder));
      },
      next: 'List',
      text: 'Creating Limit Order'
    });
  }
}

export default connect(
  state => ({
    quoteSymbol: state.settings.quoteSymbol
  }),
  dispatch => ({ dispatch })
)(PreviewLimitOrder);

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
