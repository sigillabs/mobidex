import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import { setError } from '../../../actions';
import { colors, getProfitLossStyle } from '../../../styles';
import { createSignSubmitOrder } from '../../../thunks';
import { formatAmount, formatAmountWithDecimals } from '../../../utils';
import Button from '../../components/Button';
import TwoColumnListItem from '../../components/TwoColumnListItem';
import TokenInput from '../../components/TokenInput';
import LogoTicker from '../../views/LogoTicker';
import { getBalanceByAddress } from '../../services/WalletService';

class CreateLimitOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: new BigNumber(0),
      amountError: false,
      price: new BigNumber(0),
      priceError: false
    };
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
      }
    } = this.props;

    let buttonLabel = null;
    let subTotal = new BigNumber(this.state.amount).mul(this.state.price);
    let fee = new BigNumber(0).negated();
    let total = subTotal.add(fee);

    if (side === 'buy') {
      subTotal = subTotal.negated();
      total = total.negated();
    }

    switch (side) {
      case 'buy':
        buttonLabel = 'Confirm Bid';
        break;

      case 'sell':
        buttonLabel = 'Confirm Ask';
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
          label={side === 'buy' ? 'Buying' : 'Selling'}
          token={base}
          containerStyle={{ marginTop: 10, marginBottom: 10, padding: 0 }}
          onChange={this.onSetValue('amount', 'amountError')}
          amount={this.state.amount}
        />
        <TokenInput
          label={'Price'}
          token={quote}
          containerStyle={{ marginTop: 10, marginBottom: 10, padding: 0 }}
          onChange={this.onSetValue('price', 'priceError')}
          amount={this.state.price}
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
          left="Total"
          right={formatAmount(total.toNumber())}
          rightStyle={getProfitLossStyle(total.toNumber())}
          topDivider={true}
          bottomDivider={true}
        />
        <TwoColumnListItem
          left="Funds Available"
          right={`${formatAmountWithDecimals(
            getBalanceByAddress(quote.address),
            quote.decimals
          )} ${quote.symbol}`}
          bottomDivider={true}
        />
        <Button large onPress={() => this.submit()} title={buttonLabel} />
      </View>
    );
  }

  onSetValue(column, errorColumn) {
    return value => {
      try {
        let amount = new BigNumber(value.replace(/,/g, ''));
        if (amount.gt(0)) {
          this.setState({ [column]: amount, [errorColumn]: false });
        } else {
          this.setState({ [column]: new BigNumber(0), [errorColumn]: true });
        }
      } catch (err) {
        this.setState({ [column]: new BigNumber(0), [errorColumn]: true });
      }
    };
  }

  async submit() {
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
    const { amount, price } = this.state;

    this.props.dispatch(
      createSignSubmitOrder(
        new BigNumber(price),
        new BigNumber(amount),
        base,
        quote,
        side
      )
    );
    this.props.navigation.push('List');
  }
}

CreateLimitOrder.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        type: PropTypes.string.isRequired,
        side: PropTypes.string.isRequired,
        product: PropTypes.shape({
          base: PropTypes.object.isRequired,
          quote: PropTypes.object.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }).isRequired
};

export default connect(
  (state, ownProps) => ({
    ...state.device,
    ...state.relayer,
    ...state.settings,
    ...state.wallet,
    ...ownProps
  }),
  dispatch => ({ dispatch })
)(CreateLimitOrder);
