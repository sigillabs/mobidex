import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React from 'react';
import { Slider } from 'react-native';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as WalletService from '../../../services/WalletService';
import { connect as connectNavigation } from '../../../navigation';
import { styles } from '../../../styles';
import {
  ActionErrorSuccessFlow,
  wrapEther,
  unwrapEther
} from '../../../thunks';
import { navigationProp } from '../../../types/props';
import {
  formatAmount,
  isDecimalOverflow,
  isValidAmount,
  reduceDecimalOverflow
} from '../../../utils';
import TokenAmount from '../../components/TokenAmount';
import TwoButtonTokenAmountKeyboardLayout from '../../layouts/TwoButtonTokenAmountKeyboardLayout';

class BaseWrapEtherScreen extends TwoButtonTokenAmountKeyboardLayout {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      dispatch: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      amount: [],
      focus: 'amount',
      amountError: false
    };
  }

  componentDidMount() {
    this.setState({
      amount: WalletService.getBalanceBySymbol('WETH')
        .toString()
        .split('')
    });
  }

  renderTop() {
    return (
      <React.Fragment>
        <TokenAmount
          label={'Wrapped Ether Amount'}
          symbol={'ETH'}
          containerStyle={{ marginTop: 10, marginBottom: 10, padding: 0 }}
          format={true}
          cursor={true}
          cursorProps={{ style: { marginLeft: 2 } }}
          amount={new BigNumber(this.state.amount.join('') || 0).toString()}
        />
        <Slider
          step={0.0001}
          minimumValue={0}
          maximumValue={this.getTotalEthereum().toNumber()}
          value={new BigNumber(this.state.amount.join('') || 0).toNumber()}
          onValueChange={this.onSliderChange}
          style={[styles.mv0, styles.mh2, styles.w100]}
        />
      </React.Fragment>
    );
  }

  onSliderChange = value => {
    this.setState({ amount: value.toString().split('') });
  };

  getDerivedAmount(column, newAmount, oldAmount) {
    const amount = reduceDecimalOverflow(newAmount.join(''), 6);
    if (this.getTotalEthereum().lt(amount || 0)) {
      return this.getTotalEthereum()
        .toString()
        .split('');
    } else {
      return amount.split('');
    }
  }

  getKeyboardProps() {
    return {
      decimal:
        this.state.amount.indexOf('.') === -1 && this.state.amount.length > 0
    };
  }

  getButtonLeftProps() {
    return {
      title: 'Cancel'
    };
  }

  getButtonRightProps() {
    return {
      icon: <FontAwesome name="check" size={24} color="white" />,
      title: '(Un)Wrap'
    };
  }

  pressLeft() {
    this.props.navigation.dismissModal();
  }

  async pressRight() {
    let amount = this.state.amount.join('');

    if (!isValidAmount(amount)) {
      this.setState({ amountError: true });
      return;
    }

    if (!isDecimalOverflow(amount)) {
      amount = formatAmount(amount).toString();
    }

    const weth = WalletService.getBalanceBySymbol('WETH');

    if (weth.gt(amount || 0)) {
      this.props.dispatch(
        ActionErrorSuccessFlow(
          this.props.navigation.componentId,
          {
            action: async () => this.unwrap,
            icon: <Entypo name="chevron-with-circle-down" size={100} />,
            label: 'Unwrapping ETH...'
          },
          'Unwrapped ETH',
          () => this.props.navigation.dismissModal()
        )
      );
    } else if (weth.lt(amount || 0)) {
      this.props.dispatch(
        ActionErrorSuccessFlow(
          this.props.navigation.componentId,
          {
            action: async () => this.wrap,
            icon: <Entypo name="chevron-with-circle-up" size={100} />,
            label: 'Wrapping ETH...'
          },
          'Wrapped ETH',
          () => this.props.navigation.dismissModal()
        )
      );
    }
  }

  getTotalEthereum() {
    const eth = WalletService.getBalanceBySymbol('ETH');
    const weth = WalletService.getBalanceBySymbol('WETH');
    return eth.add(weth);
  }

  wrap = async () => {
    const { amount } = this.state;
    const weth = WalletService.getBalanceBySymbol('WETH');
    const wrapAmount = new BigNumber(amount || 0).sub(weth);

    await this.props.dispatch(wrapEther(wrapAmount));
  };

  unwrap = async () => {
    const { amount } = this.state;
    const weth = WalletService.getBalanceBySymbol('WETH');
    const unwrapAmount = weth.sub(amount || 0);

    await this.props.dispatch(unwrapEther(unwrapAmount));
  };
}

export default connect(() => ({}), dispatch => ({ dispatch }))(
  connectNavigation(BaseWrapEtherScreen)
);
