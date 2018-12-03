import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Slider, View } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as WalletService from '../../../../services/WalletService';
import { connect as connectNavigation } from '../../../../navigation';
import { styles } from '../../../../styles';
import { wrapEther, unwrapEther } from '../../../../thunks';
import { navigationProp } from '../../../../types/props';
import {
  formatAmount,
  isDecimalOverflow,
  isValidAmount,
  processVirtualKeyboardCharacter,
  reduceDecimalOverflow
} from '../../../../utils';
import BigCenter from '../../../components/BigCenter';
import TokenAmount from '../../../components/TokenAmount';
import TokenAmountKeyboard from '../../../components/TokenAmountKeyboard';
import Wrapping from './Wrapping';
import Unwrapping from './Unwrapping';

class BaseWrapEtherScreen extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      dispatch: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      amount: '',
      amountError: false,
      wrapping: false,
      unwrapping: false
    };
  }

  componentDidMount() {
    this.setState({
      amount: WalletService.getBalanceBySymbol('WETH').toString()
    });
  }

  render() {
    if (this.state.wrapping) {
      return <Wrapping />;
    }

    if (this.state.unwrapping) {
      return <Unwrapping />;
    }

    return (
      <BigCenter>
        <TokenAmount
          label={'Wrapped Ether Amount'}
          symbol={'ETH'}
          containerStyle={{ marginTop: 10, marginBottom: 10, padding: 0 }}
          format={true}
          cursor={true}
          cursorProps={{ style: { marginLeft: 2 } }}
          amount={new BigNumber(this.state.amount || 0).toString()}
        />
        <Slider
          step={0.0001}
          minimumValue={0}
          maximumValue={this.getTotalEthereum().toNumber()}
          value={new BigNumber(this.state.amount || 0).toNumber()}
          onValueChange={this.setAmount}
          style={[styles.mv0, styles.mh2, styles.w100]}
        />
        <TokenAmountKeyboard
          onChange={this.onSetAmountKeyboard}
          onSubmit={this.submit}
          pressMode="char"
          buttonTitle="Wrap/Unwrap"
          buttonIcon={<Icon name="check" size={24} color="white" />}
        />
      </BigCenter>
    );
  }

  setAmount = amount => {
    amount = reduceDecimalOverflow(amount, 6);
    if (this.getTotalEthereum().lt(amount || 0)) {
      amount = this.getTotalEthereum().toString();
    }
    if (isValidAmount(amount)) {
      if (isDecimalOverflow(amount)) {
        this.setState({
          amount: formatAmount(amount).toString(),
          amountError: false
        });
      } else {
        this.setState({
          amount: amount,
          amountError: false
        });
      }
    } else {
      this.setState({ amountError: true });
    }
  };

  onSetAmountKeyboard = value => {
    const text = processVirtualKeyboardCharacter(
      value,
      this.state.amount.toString()
    );

    this.setAmount(text);
  };

  submit = () => {
    const { amount } = this.state;
    const weth = WalletService.getBalanceBySymbol('WETH');

    if (weth.gt(amount || 0)) {
      this.unwrap();
    } else if (weth.lt(amount || 0)) {
      this.wrap();
    }
  };

  getTotalEthereum() {
    const eth = WalletService.getBalanceBySymbol('ETH');
    const weth = WalletService.getBalanceBySymbol('WETH');
    return eth.add(weth);
  }

  wrap() {
    const { amount } = this.state;
    const weth = WalletService.getBalanceBySymbol('WETH');
    const wrapAmount = new BigNumber(amount || 0).sub(weth);

    this.setState({ wrapping: true });

    requestAnimationFrame(async () => {
      try {
        await this.props.dispatch(wrapEther(wrapAmount));
      } catch (err) {
        return this.props.navigation.showErrorModal(err);
      } finally {
        this.setState({ wrapping: false });
      }

      this.props.navigation.pop();
    });
  }

  unwrap() {
    const { amount } = this.state;
    const weth = WalletService.getBalanceBySymbol('WETH');
    const unwrapAmount = weth.sub(amount || 0);

    this.setState({ unwrapping: true });

    requestAnimationFrame(async () => {
      try {
        await this.props.dispatch(unwrapEther(unwrapAmount));
      } catch (err) {
        return this.props.navigation.showErrorModal(err);
      } finally {
        this.setState({ unwrapping: false });
      }

      this.props.navigation.pop();
    });
  }
}

export default connect(() => ({}), dispatch => ({ dispatch }))(
  connectNavigation(BaseWrapEtherScreen)
);
