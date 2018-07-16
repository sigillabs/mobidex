import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { formatAmount, formatMoney } from '../../../utils';
import AddressInput from '../../components/AddressInput';
import Button from '../../components/Button';
import TwoColumnListItem from '../../components/TwoColumnListItem';
import * as TickerService from '../../services/TickerService';

class AccountPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: '',
      error: false
    };
  }

  render() {
    const { token, amount } = this.props;
    const forex = TickerService.getForexTicker(token.symbol);
    const forexAmount = forex
      ? new BigNumber(amount).mul(forex.price).toNumber()
      : null;

    return (
      <View style={{ padding: 20, flex: 1, width: '100%' }}>
        <TwoColumnListItem
          left="Amount"
          right={`${formatAmount(amount)} ${token.symbol}`}
          style={{ marginBottom: 10, marginTop: 10 }}
          leftStyle={{ flex: 1, color: 'black' }}
          rightStyle={{ flex: 1, color: 'black' }}
          rowStyle={{ flex: 0, width: '100%' }}
        />
        {forexAmount ? (
          <TwoColumnListItem
            left="Amount"
            right={formatMoney(forexAmount)}
            style={{ marginBottom: 10, marginTop: 10 }}
            leftStyle={{ flex: 1, color: 'black' }}
            rightStyle={{ flex: 1, color: 'black' }}
            rowStyle={{ flex: 0, width: '100%' }}
          />
        ) : null}
        <AddressInput
          placeholder="Address"
          onChangeText={v => this.setState({ address: v })}
          keyboardType="ascii-capable"
          containerStyle={{ width: '100%', marginBottom: 10 }}
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
    if (/^(0x)?[a-fA-F0-9]{40}$/.test(this.state.address)) {
      this.props.onSubmit(this.state.address);
    } else {
      this.setState({ error: true });
    }
  }
}

AccountPage.propTypes = {
  token: PropTypes.object.isRequired,
  amount: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default connect(
  state => ({
    ticker: state.ticker,
    ...state
  }),
  dispatch => ({ dispatch })
)(AccountPage);
