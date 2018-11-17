import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { InteractionManager, View } from 'react-native';
import {
  isValidAmount,
  processVirtualKeyboardCharacter
} from '../../../../utils';
import FullScreen from '../../../components/FullScreen';
import TokenAmountKeyboard from '../../../components/TokenAmountKeyboard';

export default class BaseFillOrders extends PureComponent {
  static get propTypes() {
    return {
      isQuoteLoading: PropTypes.bool,
      isQuoteEmpty: PropTypes.bool,
      isQuoteError: PropTypes.bool,
      renderQuoteAmount: PropTypes.func.isRequired,
      renderQuoteEmpty: PropTypes.func.isRequired,
      renderQuoteError: PropTypes.func.isRequired,
      loadQuote: PropTypes.func.isRequired,
      preview: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      amount: '',
      amountError: null
    };

    this.loadQuote = _.debounce(() => {
      const { amount } = this.state;
      InteractionManager.runAfterInteractions(async () => {
        try {
          this.props.loadQuote(amount);
        } catch (err) {
          this.setState({ amountError: err });
        }
      });
    }, 500);
  }

  componentDidUpdate(prevProps, prevState) {
    const { amount } = this.state;
    if (prevState.amount !== amount) {
      this.loadQuote();
    }
  }

  render() {
    const { isQuoteEmpty, isQuoteError, isQuoteLoading } = this.props;

    return (
      <FullScreen>
        {this.props.renderQuoteAmount(this.state.amount)}
        <TokenAmountKeyboard
          onChange={this.onSetAmount}
          onSubmit={this.onSubmit}
          pressMode="char"
          buttonTitle={'Preview Buy Orders'}
          buttonLoading={isQuoteLoading}
          disableButton={isQuoteEmpty || Boolean(this.state.amountError)}
        />
        {isQuoteEmpty && !isQuoteError && !isQuoteLoading
          ? this.props.renderQuoteEmpty(this.state.amount)
          : null}
        {isQuoteError && !isQuoteLoading
          ? this.props.renderQuoteError(this.state.amount)
          : null}
      </FullScreen>
    );
  }

  onSubmit = () => {
    const { amount } = this.state;

    if (isValidAmount(amount)) {
      this.props.preview(amount);
    }
  };

  onSetAmount = value => {
    const text = processVirtualKeyboardCharacter(
      value,
      this.state.amount.toString()
    );

    if (isValidAmount(text)) {
      this.setState({ amount: text, amountError: false });
    } else {
      this.setState({ amountError: true });
    }
  };
}
