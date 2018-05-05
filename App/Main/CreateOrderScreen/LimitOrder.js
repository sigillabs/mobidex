import React, { Component } from 'react';
import { View } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import BigNumber from 'bignumber.js';
import { setError } from '../../../actions';
import { createSignSubmitOrder } from '../../../thunks';
import { formatAmount, formatPercent } from '../../../utils';
import Button from '../../components/Button';
import ListItemDetail from '../../components/ListItemDetail';
import ButtonGroup from '../../components/ButtonGroup';
import TokenInput from '../../components/TokenInput';
import LogoTicker from '../../views/LogoTicker';

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
      },
      orders
    } = this.props;

    const subTotal = new BigNumber(this.state.amount).mul(this.state.price);
    const fee = new BigNumber(0);
    const total = subTotal.add(fee);

    let buttonLabel = null;

    switch (side) {
      case 'buy':
        buttonLabel = `Bid ${base.symbol}`;
        break;

      case 'sell':
        buttonLabel = `Ask ${base.symbol}`;
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
        <ListItemDetail
          left="Sub-Total"
          right={`${side === 'buy' ? '-' : ''}${formatAmount(
            subTotal.toNumber()
          )}`}
          rightStyle={side === 'buy' ? styles.loss : styles.profit}
        />
        <ListItemDetail
          left="Fee"
          right={`-${formatAmount(fee.toNumber())}`}
          rightStyle={styles.loss}
        />
        <ListItemDetail
          left="Total"
          right={`${side === 'buy' ? '-' : ''}${formatAmount(
            total.toNumber()
          )}`}
          rightStyle={side === 'buy' ? styles.loss : styles.profit}
        />
        <Button
          large
          onPress={this.submit}
          icon={<Icon name="check" size={24} color="white" />}
          title={buttonLabel}
        />
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

  submit = async () => {
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
    let { amount, price } = this.state;

    let result = await this.props.dispatch(
      createSignSubmitOrder(
        new BigNumber(price),
        new BigNumber(amount),
        base,
        quote,
        side
      )
    );

    if (result) {
      this.props.navigation.push('List');
    }
  };
}

const styles = {
  profit: {
    color: 'green'
  },
  loss: {
    color: 'red'
  }
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
