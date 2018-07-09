import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { isValidAmount } from '../../../utils';
import TokenAmount from '../../components/TokenAmount';
import LogoTicker from '../../views/LogoTicker';
import TokenAmountKeyboard from '../../views/TokenAmountKeyboard';
import { createOrder } from '../../services/OrderService';
import NavigationService from '../../services/NavigationService';

export default class CreateLimitOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: '',
      amountError: false,
      price: '',
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
      <View style={{ width: '100%', height: '100%' }}>
        <LogoTicker token={base} />
        <TokenAmount
          label={side === 'buy' ? 'Buying' : 'Selling'}
          symbol={base.symbol}
          containerStyle={{ marginTop: 10, marginBottom: 10, padding: 0 }}
          onPress={() => this.setState({ focus: 'amount' })}
          format={false}
          cursor={this.state.focus === 'amount'}
          cursorProps={{ style: { marginLeft: 2 } }}
          amount={this.state.amount.toString()}
        />
        <TokenAmount
          label={'Price'}
          symbol={quote.symbol}
          containerStyle={{ marginTop: 10, marginBottom: 10, padding: 0 }}
          onPress={() => this.setState({ focus: 'price' })}
          format={false}
          cursor={this.state.focus === 'price'}
          cursorProps={{ style: { marginLeft: 2 } }}
          amount={this.state.price.toString()}
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
      } else if (value === '.') {
        newText = text + value;
      } else {
        newText = text + value;
      }
    } else {
      newText = text + value;
    }

    if (isValidAmount(newText)) {
      this.setState({ [column]: newText, [errorColumn]: false });
    } else {
      this.setState({ [errorColumn]: true });
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

    if (!isValidAmount(amount) || !amount) {
      this.setState({ amountError: true });
      return;
    }

    if (!isValidAmount(price) || !price) {
      this.setState({ priceError: true });
      return;
    }

    let order;

    try {
      order = await createOrder({
        baseAddress: base.address,
        quoteAddress: quote.address,
        price,
        amount,
        side
      });
    } catch (error) {
      NavigationService.error(error);
      return;
    }

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
