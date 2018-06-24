import { ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { loadOrders } from '../../../thunks';
import {
  filterAndSortOrdersByTokens,
  filterOrdersToBaseAmount
} from '../../../utils';
import TokenInput from '../../components/TokenInput';
import LogoTicker from '../../views/LogoTicker';
import TokenAmountKeyboard from '../../views/TokenAmountKeyboard';
import NavigationService from '../../services/NavigationService';

class FillOrders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: new BigNumber(0),
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
      <View>
        <LogoTicker token={base} />
        <TokenInput
          label={this.getTokenInputTitle()}
          token={base}
          containerStyle={{ marginTop: 10, marginBottom: 10, padding: 0 }}
          amount={this.state.amount.toString()}
          editable={false}
        />
        <TokenAmountKeyboard
          onChange={value => this.onSetAmount(value)}
          onSubmit={() => this.submit()}
          pressMode="string"
          buttonTitle={this.getButtonTitle()}
        />
      </View>
    );
  }

  getMakerToken() {
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
    if (side === 'buy') {
      return quote;
    } else if (side === 'sell') {
      return base;
    } else {
      return null;
    }
  }

  getTakerToken() {
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
    if (side === 'buy') {
      return base;
    } else if (side === 'sell') {
      return quote;
    } else {
      return null;
    }
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
    try {
      let amount = new BigNumber(value.replace(/,/g, ''));
      if (amount.gt(0)) {
        this.setState({ amount: amount, amountError: false });
      } else {
        this.setState({ amount: new BigNumber(0), amountError: true });
      }
    } catch (err) {
      this.setState({ amount: new BigNumber(0), amountError: true });
    }
  }

  submit() {
    let {
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
    const makerToken = this.getMakerToken();
    const takerToken = this.getTakerToken();
    const { amount, price } = this.state;
    const baseAmount =
      side === 'buy'
        ? ZeroEx.toBaseUnitAmount(
            new BigNumber(amount || 0).mul(price || 0),
            quote.decimals
          )
        : ZeroEx.toBaseUnitAmount(new BigNumber(amount || 0), base.decimals);

    const fillableOrders = filterAndSortOrdersByTokens(
      orders,
      makerToken.address,
      takerToken.address
    );
    const ordersToFill = filterOrdersToBaseAmount(
      fillableOrders,
      baseAmount,
      true
    );

    if (ordersToFill.length > 0) {
      NavigationService.navigate('PreviewOrders', {
        type: 'fill',
        side,
        amount: baseAmount,
        orders: ordersToFill,
        product: { base, quote }
      });
    }
  }
}

FillOrders.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
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

export default connect(
  state => ({ orders: state.relayer.orders }),
  dispatch => ({ dispatch })
)(FillOrders);
