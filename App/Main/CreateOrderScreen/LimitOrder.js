import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import BigNumber from 'bignumber.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { printOrder } from '../../../utils';
import TokenInput from '../../components/TokenInput';
import LogoTicker from '../../views/LogoTicker';
import TokenAmountKeyboard from '../../views/TokenAmountKeyboard';
import { createOrder } from '../../services/OrderService';
import NavigationService from '../../services/NavigationService';

export default class CreateLimitOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: new BigNumber(0),
      amountError: false,
      price: new BigNumber(0),
      priceError: false,
      focus: 'amount'
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

    if (side !== 'buy' && side !== 'sell') {
      NavigationService.goBack();
    }

    return (
      <View>
        <LogoTicker token={base} />
        <TokenInput
          label={side === 'buy' ? 'Buying' : 'Selling'}
          token={base}
          containerStyle={{ marginTop: 10, marginBottom: 10, padding: 0 }}
          onFocus={() => this.setState({ focus: 'amount' })}
          amount={this.state.amount.toString()}
          editable={false}
        />
        <TokenInput
          label={'Price'}
          token={quote}
          containerStyle={{ marginTop: 10, marginBottom: 10, padding: 0 }}
          onFocus={() => this.setState({ focus: 'price' })}
          amount={this.state.price.toString()}
          editable={false}
        />
        <TokenAmountKeyboard
          onChange={c => this.onSetValue(this.state.focus, c)}
          onSubmit={() =>
            this.state.focus === 'amount'
              ? this.setState({ focus: 'price' })
              : this.submit()
          }
          pressMode="char"
          buttonTitle={this.getButtonTitle()}
          buttonIcon={this.getButtonIcon()}
          buttonIconRight={this.getButtonIconRight()}
        />
      </View>
    );
  }

  getButtonTitle() {
    if (this.state.focus === 'price') {
      if (this.props.navigation.state.params.side === 'buy') {
        return 'Preview Buy Order';
      } else if (this.props.navigation.state.params.side === 'sell') {
        return 'Preview Sell Order';
      } else {
        return null;
      }
    } else if (this.state.focus === 'amount') {
      return 'Next';
    }
  }

  getButtonIcon() {
    if (this.state.focus === 'amount') {
      return (
        <MaterialCommunityIcons
          name="arrow-collapse-right"
          color="white"
          size={15}
        />
      );
    }
  }

  getButtonIconRight() {
    return this.state.focus === 'amount';
  }

  onSetValue(column, value) {
    const errorColumn = `${column}Error`;
    const text = this.state[column].toString();
    let newText = null;

    if (isNaN(value)) {
      if (value === 'back') {
        newText = text.slice(0, -1);
      } else {
        newText = text + value;
      }
    } else {
      newText = text + value;
    }

    try {
      const newValue = new BigNumber(newText);
      if (newValue.gt(0)) {
        this.setState({ [column]: newValue, [errorColumn]: false });
      } else {
        this.setState({ [column]: new BigNumber(0), [errorColumn]: true });
      }
    } catch (err) {
      this.setState({ [column]: new BigNumber(0), [errorColumn]: true });
    }
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
    const order = await createOrder({
      baseAddress: quote.address,
      quoteAddress: base.address,
      price,
      amount,
      side
    });

    NavigationService.navigate('PreviewOrders', {
      type: 'limit',
      order: order,
      side,
      product: { base, quote }
    });
  }
}

CreateLimitOrder.propTypes = {
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
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
