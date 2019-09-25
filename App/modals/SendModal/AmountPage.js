import {BigNumber} from '@uniswap/sdk';
import PropTypes from 'prop-types';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {connect} from 'react-redux';
import * as AssetService from '../../../services/AssetService';
import {GasService} from '../../../services/GasService';
import {styles} from '../../../styles';
import {refreshGasPrice} from '../../../thunks';
import {formatAmount, isValidAmount} from '../../../lib/utils';
import {addressProp, BigNumberProp} from '../../../types/props';
import MaxButton from '../../components/MaxButton';
import Row from '../../components/Row';
import InputTokenAmount from '../../components/InputTokenAmount';
import TouchableInputTokenAmount from '../../components/TouchableInputTokenAmount';
import TwoButtonTokenAmountKeyboardLayout from '../../layouts/TwoButtonTokenAmountKeyboardLayout';

class AmountPage extends TwoButtonTokenAmountKeyboardLayout {
  static get propTypes() {
    return {
      balance: BigNumberProp,
      gasPrice: BigNumberProp,
      tokenAddress: addressProp,
      onPrevious: PropTypes.func.isRequired,
      onNext: PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      amount: [],
      focus: 'amount',
    };
  }

  async componentDidMount() {
    this.props.dispatch(refreshGasPrice());
  }

  renderTop() {
    const {tokenAddress, balance} = this.props;
    const asset = AssetService.findAssetByAddress(tokenAddress);

    return (
      <React.Fragment>
        <InputTokenAmount
          label={'Wallet Amount'}
          symbol={asset.symbol}
          icon={<Entypo name="wallet" size={30} />}
          containerStyle={{
            marginTop: 10,
            marginBottom: 10,
            padding: 0,
          }}
          symbolStyle={{marginRight: 10}}
          format={false}
          cursor={false}
          amount={formatAmount(balance ? balance : '0')}
          onPress={() => this.setState({focus: 'amount'})}
        />
        <Row style={[styles.w100, styles.flex1]}>
          <TouchableInputTokenAmount
            label={'Send Amount'}
            symbol={asset.symbol}
            containerStyle={{
              flex: 1,
              marginTop: 10,
              marginBottom: 10,
              padding: 0,
            }}
            symbolStyle={{marginRight: 10}}
            format={false}
            cursor={this.state.focus === 'amount'}
            cursorProps={{style: {marginLeft: 2}}}
            amount={this.state.amount.join('')}
            onPress={() => this.setState({focus: 'amount'})}
            wrapperStyle={[styles.flex1]}
          />
          <MaxButton
            buttonStyle={[styles.mt3]}
            onPress={this.setMaxTokenAmount}
          />
        </Row>
      </React.Fragment>
    );
  }

  getKeyboardProps() {
    const {focus} = this.state;
    return {
      decimal:
        this.state[focus].indexOf('.') === -1 && this.state[focus].length > 0,
    };
  }

  getButtonLeftProps() {
    return {
      title: 'Cancel',
    };
  }

  getButtonRightProps() {
    return {
      title: 'Next',
    };
  }

  async pressLeft() {
    this.props.onPrevious();
  }

  async pressRight() {
    try {
      new BigNumber(this.state.amount.join(''));
      this.props.onNext(this.state.amount.join(''));
    } catch (err) {
      console.warn('Should never get here', err);
    }
  }

  setColumn(column, valueArray) {
    if (!valueArray) {
      return;
    }

    const valueText = valueArray.join('');

    if (!isValidAmount(valueText) && valueText !== '') {
      return;
    }

    let amount = valueArray;

    this.setState({
      amount,
    });
  }

  setMaxTokenAmount = async () => {
    const {tokenAddress, balance, gasPrice} = this.props;
    let amount = balance;

    if (AssetService.isEthereum(tokenAddress)) {
      const gas = await GasService.instance.EthereumSend();
      const gasFee = this.props.gasPrice.times(gas);

      amount = amount.minus(gasFee).integerValue();
    }

    this.setColumn('amount', amount.toString().split(''));
  };
}

function extractProps(state, props) {
  const {
    wallet: {balances},
    settings: {gasPrice},
  } = state;
  const {tokenAddress} = props;
  const balance = balances[tokenAddress];
  return {balance, gasPrice: new BigNumber(gasPrice)};
}

export default connect(
  extractProps,
  dispatch => ({dispatch}),
)(AmountPage);
