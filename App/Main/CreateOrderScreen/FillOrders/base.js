import { BigNumber } from '0x.js';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import * as styles from '../../../../styles';
import {
  isValidAmount,
  processVirtualKeyboardCharacter
} from '../../../../utils';
import MutedText from '../../../components/MutedText';
import TokenAmount from '../../../components/TokenAmount';
import TokenAmountKeyboard from '../../../components/TokenAmountKeyboard';

export default class BaseFillOrders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: '',
      amountError: false,
      quote: null,
      loadingQuote: false
    };

    this.loadQuote = _.debounce(async () => {
      this.setState({ loadingQuote: true });
      const quote = await this.props.getQuote(
        this.props.baseToken,
        this.props.quoteToken,
        this.state.amount || 0
      );
      this.setState({ quote, loadingQuote: false });
    }, 100);
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.amount !== this.state.amount) {
      this.loadQuote();
    }
  }

  render() {
    const { baseToken, buttonTitle, inputTitle } = this.props;
    const isEmptyQuote =
      this.state.quote === null || this.state.quote.orders.length === 0;

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
          right={this.props.renderQuote(this.state.quote)}
        />
        <TokenAmountKeyboard
          onChange={value => this.onSetAmount(value)}
          onSubmit={() => this.submit()}
          pressMode="char"
          buttonTitle={buttonTitle}
          disableButton={isEmptyQuote}
          buttonLoading={this.state.loadingQuote}
        />
        {isEmptyQuote ? (
          <MutedText
            style={[styles.flex1, styles.row, styles.center, styles.textcenter]}
          >
            If button is disabled, it means there are no orders to fill.
          </MutedText>
        ) : null}
      </View>
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
    const amount = new BigNumber(this.state.amount || 0);
    const quote = await this.props.getQuote(baseToken, quoteToken, amount);
    if (!quote || quote.orders.length === 0) {
      return;
    }
    this.props.preview(quote);
  }
}

BaseFillOrders.propTypes = {
  baseToken: PropTypes.object.isRequired,
  quoteToken: PropTypes.object.isRequired,
  buttonTitle: PropTypes.string.isRequired,
  inputTitle: PropTypes.string.isRequired,
  renderQuote: PropTypes.func.isRequired,
  getQuote: PropTypes.func.isRequired,
  preview: PropTypes.func.isRequired
};
