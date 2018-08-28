import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Slider, View } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as WalletService from '../../../services/WalletService';
import NavigationService from '../../../services/NavigationService';
import * as styles from '../../../styles';
import { wrapEther, unwrapEther } from '../../../thunks';
import {
  formatAmount,
  isDecimalOverflow,
  isValidAmount,
  processVirtualKeyboardCharacter
} from '../../../utils';
import TokenAmount from '../../components/TokenAmount';
import TokenAmountKeyboard from '../../components/TokenAmountKeyboard';
import Wrapping from './Wrapping';
import Unwrapping from './Unwrapping';

class WrapEtherScreen extends Component {
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

  UNSAFE_componentWillMount() {
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
      <View style={{ width: '100%', height: '100%' }}>
        <TokenAmount
          label={'Wrapped Ether Amount'}
          symbol={'ETH'}
          containerStyle={{ marginTop: 10, marginBottom: 10, padding: 0 }}
          format={true}
          cursor={true}
          cursorProps={{ style: { marginLeft: 2 } }}
          amount={new BigNumber(this.state.amount || 0)}
        />
        <Slider
          step={0.0001}
          minimumValue={0}
          maximumValue={this.getTotalEthereum().toNumber()}
          value={new BigNumber(this.state.amount || 0).toNumber()}
          onValueChange={value => this.setAmount(value)}
          style={[styles.mv0, styles.mh2]}
        />
        <TokenAmountKeyboard
          onChange={c => this.onSetAmountKeyboard(c)}
          onSubmit={() => this.submit()}
          pressMode="char"
          buttonTitle="Wrap/Unwrap"
          buttonIcon={<Icon name="check" size={24} color="white" />}
        />
      </View>
    );
  }

  getTotalEthereum() {
    const eth = WalletService.getBalanceBySymbol('ETH');
    const weth = WalletService.getBalanceBySymbol('WETH');
    return eth.add(weth);
  }

  setAmount(amount) {
    if (this.getTotalEthereum().lt(amount)) {
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
  }

  onSetAmountKeyboard(value) {
    const text = processVirtualKeyboardCharacter(
      value,
      this.state.amount.toString()
    );

    this.setAmount(text);
  }

  async wrap() {
    const { amount } = this.state;
    const weth = WalletService.getBalanceBySymbol('WETH');
    const wrapAmount = new BigNumber(amount || 0).sub(weth);

    this.setState({ wrapping: true });
    this.props.navigation.setParams({ hideHeader: true });

    try {
      await this.props.dispatch(wrapEther(wrapAmount));
    } catch (err) {
      return err;
    } finally {
      this.setState({ wrapping: false });
      this.props.navigation.setParams({ hideHeader: false });
    }

    return null;
  }

  async unwrap() {
    const { amount } = this.state;
    const weth = WalletService.getBalanceBySymbol('WETH');
    const unwrapAmount = weth.sub(amount || 0);

    this.setState({ unwrapping: true });
    this.props.navigation.setParams({ hideHeader: true });

    try {
      await this.props.dispatch(unwrapEther(unwrapAmount));
    } catch (err) {
      return err;
    } finally {
      this.setState({ unwrapping: false });
      this.props.navigation.setParams({ hideHeader: false });
    }

    return null;
  }

  async submit() {
    const { amount } = this.state;
    const weth = WalletService.getBalanceBySymbol('WETH');

    let err = null;
    if (weth.gt(amount || 0)) {
      err = await this.unwrap();
    } else if (weth.lt(amount || 0)) {
      err = await this.wrap();
    } else {
      NavigationService.navigate('Accounts');
      return;
    }

    if (err) {
      NavigationService.error(err);
      return;
    }

    NavigationService.navigate('Accounts');
  }
}

WrapEtherScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigation: PropTypes.object
};

export default connect(state => ({}), dispatch => ({ dispatch }))(
  WrapEtherScreen
);
