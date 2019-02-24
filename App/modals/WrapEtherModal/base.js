import { BigNumber } from '0x.js';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import PropTypes from 'prop-types';
import React from 'react';
import { Slider, View } from 'react-native';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { formatUnitValue } from '../../../lib/utils/format';
import * as WalletService from '../../../services/WalletService';
import { connect as connectNavigation } from '../../../navigation';
import { styles } from '../../../styles';
import {
  ReceiptActionErrorSuccessFlow,
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
      <View style={[styles.center, styles.mv3]}>
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
      </View>
    );
  }

  onSliderChange = value => {
    this.setState({ amount: value.toString().split('') });
  };

  getDerivedAmount(column, newAmount, oldAmount) {
    const amount = reduceDecimalOverflow(newAmount.join(''), 6);
    if (!amount) return [];
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
        ReceiptActionErrorSuccessFlow(
          this.props.navigation.componentId,
          {
            gas: await WalletService.estimateWithdraw(
              this.getWETHChange().neg()
            ),
            value: 0
          },
          {
            action: this.unwrap,
            icon: <Entypo name="chevron-with-circle-down" size={100} />,
            label: 'Unwrapping ETH...'
          },
          'Unwrapped ETH',
          () => this.props.navigation.dismissModal()
        )
      );
    } else if (weth.lt(amount || 0)) {
      this.props.dispatch(
        ReceiptActionErrorSuccessFlow(
          this.props.navigation.componentId,
          {
            gas: await WalletService.estimateDeposit(this.getWETHChange()),
            value: this.getWETHChange()
          },
          {
            action: this.wrap,
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

  getWETHChange() {
    const { amount } = this.state;
    const weth = WalletService.getBalanceBySymbol('WETH');
    const formattedAmount = formatUnitValue(
      new BigNumber(amount.join('') || 0).sub(weth)
    );
    return Web3Wrapper.toBaseUnitAmount(formattedAmount, 18);
  }

  wrap = async () => {
    await this.props.dispatch(wrapEther(this.getWETHChange(), { wei: true }));
  };

  unwrap = async () => {
    await this.props.dispatch(
      unwrapEther(this.getWETHChange().neg(), { wei: true })
    );
  };
}

export default connect(
  () => ({}),
  dispatch => ({ dispatch })
)(connectNavigation(BaseWrapEtherScreen));
