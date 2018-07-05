import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { formatMoney } from '../../../utils';
import TokenInput from '../../components/TokenInput';
import TwoColumnListItem from '../../components/TwoColumnListItem';
import TokenAmountKeyboard from '../../views/TokenAmountKeyboard';
import * as TickerService from '../../services/TickerService';

class AmountPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: '0',
      error: false
    };
  }

  render() {
    const { token } = this.props;
    const forex = TickerService.getForexTicker(token.symbol);
    const forexAmount = forex
      ? new BigNumber(this.state.amount).mul(forex.price).toNumber()
      : null;

    return (
      <View style={{ padding: 20, flex: 1, width: '100%' }}>
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
        <TokenInput
          token={token}
          containerStyle={{ marginTop: 10, marginBottom: 10, padding: 0 }}
          onChange={v => this.setState({ amount: v })}
          amount={this.state.amount.toString()}
          autoFocus={false}
        />
        <TokenAmountKeyboard
          onChange={value => this.setState({ amount: value })}
          onSubmit={() => this.submit()}
          pressMode="string"
          buttonTitle={'Next'}
        />
      </View>
    );
  }

  async submit() {
    try {
      new BigNumber(this.state.amount);
      this.props.onSubmit(this.state.amount);
    } catch (err) {
      this.setState({ error: true });
    }
  }
}

AmountPage.propTypes = {
  token: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default connect(
  state => ({
    settings: state.settings,
    ticker: state.ticker
  }),
  dispatch => ({ dispatch })
)(AmountPage);
