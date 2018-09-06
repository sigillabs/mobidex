import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import * as OrderService from '../../../../services/OrderService';
import * as styles from '../../../../styles';
import {
  isValidAmount,
  processVirtualKeyboardCharacter
} from '../../../../utils';
import FormattedTokenAmount from '../../../components/FormattedTokenAmount';
import MutedText from '../../../components/MutedText';
import TokenAmount from '../../../components/TokenAmount';
import TokenAmountKeyboard from '../../../components/TokenAmountKeyboard';

export default class BaseFillOrders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: '',
      amountError: false
    };
  }

  render() {
    const { baseToken, buttonTitle, inputTitle, quoteToken } = this.props;
    const fillableOrders = this.getFillableOrders();

    return (
      <View style={{ width: '100%', height: '100%' }}>
        <TokenAmount
          label={inputTitle}
          symbol={baseToken.symbol}
          containerStyle={{ marginTop: 10, marginBottom: 10, padding: 0 }}
          amount={this.state.amount.toString()}
          cursor={true}
          cursorProps={{ style: { marginLeft: 2 } }}
          format={false}
          right={
            <FormattedTokenAmount
              amount={this.getAveragePrice()}
              symbol={quoteToken.symbol}
            />
          }
        />
        <TokenAmountKeyboard
          onChange={value => this.onSetAmount(value)}
          onSubmit={() => this.submit()}
          pressMode="char"
          buttonTitle={buttonTitle}
          disableButton={!fillableOrders || fillableOrders.length === 0}
        />
        {!fillableOrders || fillableOrders.length === 0 ? (
          <MutedText
            style={[styles.flex1, styles.row, styles.center, styles.textcenter]}
          >
            If button is disabled, it means there are no orders to fill.
          </MutedText>
        ) : null}
      </View>
    );
  }

  getAveragePrice() {
    const orders = this.getFillableOrders();

    if (!orders) {
      return null;
    }

    return OrderService.getAveragePrice(orders);
  }

  getFillableOrders() {
    const { baseToken, quoteToken } = this.props;

    if (!isValidAmount(this.state.amount)) {
      return null;
    }

    return this.props.getFillableOrders(
      baseToken,
      quoteToken,
      new BigNumber(this.state.amount || 0)
    );
  }

  onSetAmount(value) {
    const text = processVirtualKeyboardCharacter(
      value,
      this.state.amount.toString()
    );

    if (isValidAmount(text)) {
      this.setState({ amount: text, amountError: false });
    } else {
      this.setState({ amountError: true });
    }
  }

  async submit() {
    const { baseToken, quoteToken } = this.props;
    const orders = this.getFillableOrders();
    if (!orders || orders.length === 0) {
      return;
    }
    this.props.preview(
      baseToken,
      quoteToken,
      new BigNumber(this.state.amount || 0),
      orders
    );
  }
}

BaseFillOrders.propTypes = {
  baseToken: PropTypes.object.isRequired,
  quoteToken: PropTypes.object.isRequired,
  buttonTitle: PropTypes.string.isRequired,
  inputTitle: PropTypes.string.isRequired,
  getAveragePrice: PropTypes.func.isRequired,
  getFillableOrders: PropTypes.func.isRequired,
  preview: PropTypes.func.isRequired
};
