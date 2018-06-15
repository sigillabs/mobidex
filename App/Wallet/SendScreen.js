import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { sendEther, sendTokens } from '../../thunks';
import { findTickerDetails, formatMoney } from '../../utils';
import AddressInput from '../components/AddressInput';
import Button from '../components/Button';
import TwoColumnListItem from '../components/TwoColumnListItem';
import TokenInput from '../components/TokenInput';

class SendScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: new BigNumber(0),
      amountError: false,
      address: '',
      addressError: false
    };
  }

  render() {
    const {
      navigation: {
        state: {
          params: { token }
        }
      },
      settings,
      ticker
    } = this.props;
    const forex = findTickerDetails(
      ticker.forex,
      token.symbol,
      settings.forexCurrency
    );
    const forexAmount = this.state.amount.mul(forex.price).toNumber();

    return (
      <View style={{ padding: 20 }}>
        <Text h4 style={{ textAlign: 'center' }}>
          Send {token.symbol}
        </Text>
        <AddressInput
          placeholder="Address"
          onChangeText={v => this.onSetAddress(v)}
          keyboardType="ascii-capable"
          containerStyle={{ width: '100%', marginBottom: 10 }}
        />
        <TokenInput
          token={token}
          containerStyle={{ marginTop: 10, marginBottom: 10, padding: 0 }}
          onChange={v => this.onSetAmount(v)}
          amount={this.state.amount}
        />
        <TwoColumnListItem
          left="Amount"
          right={formatMoney(forexAmount)}
          style={{ marginBottom: 10, marginTop: 10 }}
          leftStyle={{ flex: 1, color: 'black' }}
          rightStyle={{ flex: 1, color: 'black' }}
          rowStyle={{ flex: 0, width: '100%' }}
        />
        <Button
          large
          onPress={() => this.submit()}
          icon={<Icon name="check" size={24} color="white" />}
          title={'Send'}
          style={{ width: '100%' }}
        />
      </View>
    );
  }

  async submit() {
    let {
      navigation: {
        state: {
          params: { token }
        }
      }
    } = this.props;
    let { address, amount } = this.state;
    if (token.address === null) {
      this.props.dispatch(sendEther(address, amount));
    } else {
      this.props.dispatch(sendTokens(token, address, amount));
    }
    this.props.navigation.goBack(null);
  }

  onSetAmount(value) {
    try {
      let amount = new BigNumber(value);
      if (amount.gt(0)) {
        this.setState({ amount: amount, amountError: false });
      } else {
        this.setState({ amount: new BigNumber(0), amountError: true });
      }
    } catch (err) {
      this.setState({ amount: new BigNumber(0), amountError: true });
    }
  }

  onSetAddress(value) {
    this.setState({ address: value, addressError: false });
  }
}

SendScreen.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        type: PropTypes.string.isRequired,
        side: PropTypes.string.isRequired,
        product: PropTypes.shape({
          base: PropTypes.object.isRequired,
          quote: PropTypes.object.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  settings: PropTypes.object,
  ticker: PropTypes.object
};

export default connect(
  state => ({
    settings: state.settings,
    ticker: state.ticker
  }),
  dispatch => ({ dispatch })
)(SendScreen);
