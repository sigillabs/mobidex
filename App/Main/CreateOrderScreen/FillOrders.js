import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import NavigationService from '../../../services/NavigationService';
import { isValidAmount, processVirtualKeyboardCharacter } from '../../../utils';
import FullScreen from '../../components/FullScreen';
import TokenAmountKeyboard from '../../components/TokenAmountKeyboard';
import TokenAmountWithOrderbookPrice from '../../views/TokenAmountWithOrderbookPrice';

export default class FillOrders extends PureComponent {
  static get propTypes() {
    return {
      side: PropTypes.string.isRequired,
      base: PropTypes.object.isRequired,
      quote: PropTypes.object.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      amount: ''
    };
  }

  render() {
    return (
      <FullScreen>
        <TokenAmountWithOrderbookPrice
          amount={this.state.amount.toString()}
          cursor={true}
          cursorProps={{ style: { marginLeft: 2 } }}
          format={false}
          side={this.props.side}
          baseSymbol={this.props.base.symbol}
          quoteSymbol={this.props.quote.symbol}
        />
        <TokenAmountKeyboard
          onChange={this.onSetAmount}
          onSubmit={this.onSubmit}
          pressMode="char"
          buttonTitle={'Preview Buy Orders'}
          disableButton={
            this.state.amount === '' || !isValidAmount(this.state.amount)
          }
        />
      </FullScreen>
    );
  }

  renderButtonTitle = () => {
    if (this.props.side === 'buy') {
      return 'Preview Buy Order';
    } else {
      return 'Preview Sell Order';
    }
  };

  onSubmit = () => {
    const { amount } = this.state;

    if (isValidAmount(amount)) {
      const { side, base, quote } = this.props;

      NavigationService.navigate('PreviewOrders', {
        type: 'fill',
        side,
        amount,
        base,
        quote
      });
    }
  };

  onSetAmount = value => {
    const text = processVirtualKeyboardCharacter(
      value,
      this.state.amount.toString()
    );

    if (isValidAmount(text)) {
      this.setState({ amount: text, amountError: false });
    }
  };
}
