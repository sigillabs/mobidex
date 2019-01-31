import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import * as TickerService from '../../../services/TickerService';
import * as WalletService from '../../../services/WalletService';
import { styles } from '../../../styles';
import { refreshGasPrice } from '../../../thunks';
import { formatAmount, getForexIcon, isValidAmount } from '../../../utils';
import MaxButton from '../../components/MaxButton';
import Row from '../../components/Row';
import TokenAmount from '../../components/TokenAmount';
import TouchableTokenAmount from '../../components/TouchableTokenAmount';
import TwoButtonTokenAmountKeyboardLayout from '../../layouts/TwoButtonTokenAmountKeyboardLayout';

class AmountPage extends TwoButtonTokenAmountKeyboardLayout {
  static get propTypes() {
    return {
      gasPrice: PropTypes.instanceOf(BigNumber),
      asset: PropTypes.object.isRequired,
      onPrevious: PropTypes.func.isRequired,
      onNext: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      amount: [],
      forex: [],
      focus: 'amount'
    };
  }

  async componentDidMount() {
    this.props.dispatch(refreshGasPrice());
  }

  renderTop() {
    const { asset } = this.props;
    const balance = WalletService.getBalanceByAddress(asset.address);

    return (
      <React.Fragment>
        <TokenAmount
          label={'Wallet Amount'}
          symbol={asset.symbol}
          icon={<Entypo name="wallet" size={30} />}
          containerStyle={{
            marginTop: 10,
            marginBottom: 10,
            padding: 0
          }}
          symbolStyle={{ marginRight: 10 }}
          format={false}
          cursor={false}
          amount={formatAmount(balance ? balance : '0')}
          onPress={() => this.setState({ focus: 'amount' })}
        />
        <Row style={[styles.w100, styles.flex1]}>
          <TouchableTokenAmount
            label={'Send Amount'}
            symbol={asset.symbol}
            containerStyle={{
              flex: 1,
              marginTop: 10,
              marginBottom: 10,
              padding: 0
            }}
            symbolStyle={{ marginRight: 10 }}
            format={false}
            cursor={this.state.focus === 'amount'}
            cursorProps={{ style: { marginLeft: 2 } }}
            amount={this.state.amount.join('')}
            onPress={() => this.setState({ focus: 'amount' })}
            wrapperStyle={[styles.flex1]}
          />
          <MaxButton
            buttonStyle={[styles.mt3]}
            onPress={this.setMaxTokenAmount}
          />
        </Row>
        <TouchableTokenAmount
          label={'Send Amount in Forex'}
          symbol={'USD'}
          icon={getForexIcon('USD', { size: 30, style: { marginLeft: 10 } })}
          containerStyle={{
            marginTop: 10,
            marginBottom: 10,
            padding: 0
          }}
          symbolStyle={{ marginRight: 10 }}
          format={false}
          cursor={this.state.focus === 'forex'}
          cursorProps={{ style: { marginLeft: 2 } }}
          amount={this.state.forex.join('')}
          onPress={() => this.setState({ focus: 'forex' })}
        />
      </React.Fragment>
    );
  }

  getKeyboardProps() {
    const { focus } = this.state;
    return {
      decimal:
        this.state[focus].indexOf('.') === -1 && this.state[focus].length > 0
    };
  }

  getButtonLeftProps() {
    return {
      title: 'Cancel'
    };
  }

  getButtonRightProps() {
    return {
      title: 'Next'
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
    const valueBN = new BigNumber(valueText || 0);

    if (!isValidAmount(valueText) && valueText !== '') {
      return;
    }

    const forexTicker = TickerService.getForexTicker(this.props.asset.symbol);
    const hasForexTicker = forexTicker && forexTicker.price;

    let amount = null;
    let forex = null;

    if (column === 'amount') {
      amount = valueArray;
      forex = hasForexTicker
        ? valueBN
            .mul(forexTicker.price)
            .toString()
            .split('')
        : [];
    } else {
      amount = hasForexTicker
        ? formatAmount(valueBN.div(forexTicker.price)).split()
        : [];
      forex = valueArray;
    }

    this.setState({
      amount,
      forex
    });
  }

  setMaxTokenAmount = async () => {
    const { asset } = this.props;
    const balance = WalletService.getBalanceByAddress(asset.address || null);
    let amount = balance;

    if (!asset.address) {
      const gasAmount = await WalletService.estimateEthSend();
      const gasPrice = WalletService.convertGasPriceToEth(this.props.gasPrice);
      const gasFee = gasPrice.mul(gasAmount);

      amount = amount.sub(gasFee);
    }

    this.setColumn('amount', amount.toString().split(''));
  };
}

export default connect(
  state => ({
    gasPrice: state.settings.gasPrice
  }),
  dispatch => ({ dispatch })
)(AmountPage);
