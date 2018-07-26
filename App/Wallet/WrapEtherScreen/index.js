import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Slider, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { isValidAmount } from '../../../types/props';
import TokenAmount from '../../components/TokenAmount';
import TokenAmountKeyboard from '../../components/TokenAmountKeyboard';
import * as WalletService from '../../services/WalletService';
import NavigationService from '../../services/NavigationService';
import Wrapping from './Wrapping';
import Unwrapping from './Unwrapping';

export default class WrapEtherScreen extends Component {
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

    const eth = WalletService.getBalanceBySymbol('ETH');
    const weth = WalletService.getBalanceBySymbol('WETH');

    return (
      <View style={{ width: '100%', height: '100%' }}>
        <TokenAmount
          label={'Wrapped Ether Amount'}
          symbol={'ETH'}
          containerStyle={{ marginTop: 10, marginBottom: 10, padding: 0 }}
          format={true}
          cursor={true}
          cursorProps={{ style: { marginLeft: 2 } }}
          amount={this.state.amount.toString()}
        />
        <Slider
          step={0.0001}
          minimumValue={0}
          maximumValue={eth.add(weth).toNumber()}
          value={weth.toNumber()}
          onValueChange={value => this.onSetAmountValue(value)}
        />
        <TokenAmountKeyboard
          onChange={c => this.onSetAmount(c)}
          onSubmit={() => this.submit()}
          pressMode="char"
          buttonTitle="Wrap/Unwrap"
          buttonIcon={<Icon name="check" size={24} color="white" />}
        />
      </View>
    );
  }

  onSetAmountValue(value) {
    this.setState({
      amount: value.toString()
    });
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

  async wrap() {
    const { amount } = this.state;
    const weth = WalletService.getBalanceBySymbol('WETH');
    const wrapAmount = new BigNumber(amount).sub(weth);

    this.setState({ wrapping: true });
    this.props.navigation.setParams({ hideHeader: true });

    try {
      await WalletService.wrapEther(wrapAmount);
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
    const unwrapAmount = weth.sub(amount);

    this.setState({ unwrapping: true });
    this.props.navigation.setParams({ hideHeader: true });

    try {
      await WalletService.unwrapEther(unwrapAmount);
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
    if (weth.gt(amount)) {
      err = await this.unwrap();
    } else if (weth.lt(amount)) {
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
  navigation: PropTypes.object
};
