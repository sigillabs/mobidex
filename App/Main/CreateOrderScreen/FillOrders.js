import { ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { loadOrders } from '../../../thunks';
import { isValidAmount } from '../../../utils';
import TokenAmount from '../../components/TokenAmount';
import TokenAmountKeyboard from '../../components/TokenAmountKeyboard';
import LogoTicker from '../../views/LogoTicker';
import NavigationService from '../../services/NavigationService';
import { getFillableOrders } from '../../services/OrderService';

class FillOrders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: '',
      amountError: false
    };
  }

  componentDidMount() {
    this.props.dispatch(loadOrders());
  }

  render() {
    const {
      navigation: {
        state: {
          params: {
            product: { base },
            side
          }
        }
      }
    } = this.props;

    if (side !== 'buy' && side !== 'sell') {
      NavigationService.goBack();
      return null;
    }

    return (
      <View style={{ width: '100%', height: '100%' }}>
        <TokenAmount
          label={this.getTokenInputTitle()}
          symbol={base.symbol}
          containerStyle={{ marginTop: 10, marginBottom: 10, padding: 0 }}
          amount={this.state.amount.toString()}
          cursor={true}
          cursorProps={{ style: { marginLeft: 2 } }}
          format={false}
        />
        <TokenAmountKeyboard
          onChange={value => this.onSetAmount(value)}
          onSubmit={() => this.submit()}
          pressMode="char"
          buttonTitle={this.getButtonTitle()}
        />
      </View>
    );
  }

  getTokenInputTitle() {
    if (this.props.navigation.state.params.side === 'buy') {
      return 'Buying';
    } else if (this.props.navigation.state.params.side === 'sell') {
      return 'Selling';
    } else {
      return null;
    }
  }

  getButtonTitle() {
    if (this.props.navigation.state.params.side === 'buy') {
      return 'Preview Buy Order';
    } else if (this.props.navigation.state.params.side === 'sell') {
      return 'Preview Sell Order';
    } else {
      return null;
    }
  }

  getBaseAmount() {
    return ZeroEx.toBaseUnitAmount(
      this.state.amount,
      this.props.navigation.state.params.product.base.decimals
    );
  }

  onSetAmount(value) {
    const text = this.state.amount.toString();
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
      this.setState({ amount: newText, amountError: false });
    } else {
      this.setState({ amountError: true });
    }
  }

  async submit() {
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
    const { amount } = this.state;

    if (!isValidAmount(amount) || !amount) {
      this.setState({ amountError: true });
      return;
    }

    const orders = await getFillableOrders(base.address, amount, side);
    const baseAmount = ZeroEx.toBaseUnitAmount(
      new BigNumber(amount || 0),
      base.decimals
    );

    if (orders.length > 0) {
      NavigationService.navigate('PreviewOrders', {
        type: 'fill',
        side,
        amount: baseAmount.toString(),
        product: { base, quote },
        orders
      });
    }
  }
}

FillOrders.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        side: PropTypes.string.isRequired,
        product: PropTypes.shape({
          base: PropTypes.object.isRequired,
          quote: PropTypes.object.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }).isRequired
};

export default connect(state => ({}), dispatch => ({ dispatch }))(FillOrders);
