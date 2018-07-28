import { ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import * as styles from '../../../styles';
import { loadOrders } from '../../../thunks';
import { isValidAmount, processVirtualKeyboardCharacter } from '../../../utils';
import FormattedTokenAmount from '../../components/FormattedTokenAmount';
import MutedText from '../../components/MutedText';
import TokenAmount from '../../components/TokenAmount';
import TokenAmountKeyboard from '../../components/TokenAmountKeyboard';
import NavigationService from '../../services/NavigationService';
import {
  getAveragePrice,
  getFillableOrders
} from '../../services/OrderService';

class FillOrders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: '',
      amountError: false,
      priceAverage: 0,
      fillableOrders: []
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
            product: { base, quote },
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
          right={
            <FormattedTokenAmount
              amount={this.state.priceAverage}
              symbol={quote.symbol}
            />
          }
        />
        <TokenAmountKeyboard
          onChange={value => this.onSetAmount(value)}
          onSubmit={() => this.submit()}
          pressMode="char"
          buttonTitle={this.getButtonTitle()}
          disableButton={this.state.fillableOrders.length === 0}
        />
        {this.state.amount && this.state.fillableOrders.length === 0 ? (
          <MutedText
            style={[styles.flex1, styles.row, styles.center, styles.textcenter]}
          >
            If button is disabled, it means there are no orders to fill.
          </MutedText>
        ) : null}
      </View>
    );
  }

  async updateAveragePrice(amount = null) {
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

    if (!amount) {
      amount = this.state.amount;
    }

    if (!isValidAmount(amount)) {
      return;
    }

    const fillableOrders = await getFillableOrders(
      base.address,
      amount || new BigNumber(0).toString(),
      side
    );

    const priceAverage = await getAveragePrice(fillableOrders, side);

    this.setState({ priceAverage, fillableOrders });
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
    const text = processVirtualKeyboardCharacter(
      value,
      this.state.amount.toString()
    );

    if (isValidAmount(text)) {
      this.setState({ amount: text, amountError: false });
    } else {
      this.setState({ amountError: true });
    }

    this.updateAveragePrice(text);
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

    if (orders.length > 0) {
      NavigationService.navigate('PreviewOrders', {
        type: 'fill',
        side,
        amount: new BigNumber(amount || 0).toString(),
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
