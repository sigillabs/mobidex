import PropTypes from 'prop-types';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect as connectNavigation } from '../../../../navigation';
import { styles } from '../../../../styles';
import { navigationProp } from '../../../../types/props';
import { isValidAmount } from '../../../../utils';
import SelectableCirclesRow from '../../../components/SelectableCirclesRow';
import TouchableTokenAmount from '../../../components/TouchableTokenAmount';
import TokenAmountKeyboardLayout from '../../../layouts/TokenAmountKeyboardLayout';
import { createOrder } from '../../../../services/OrderService';

const EXPIRATION_LABELS = ['1 min', '1 hour', '1 day', '1 mon', '1 year'];
const EXPIRATION_VALUES = [
  60,
  60 * 60,
  24 * 60 * 60,
  30 * 24 * 60 * 60,
  365 * 24 * 60 * 60
];

class CreateLimitOrder extends TokenAmountKeyboardLayout {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      side: PropTypes.string.isRequired,
      base: PropTypes.object.isRequired,
      quote: PropTypes.object.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      amount: [],
      price: [],
      focus: 'amount',
      expirationIndex: 2
    };
  }

  renderTop() {
    const { base, quote, side } = this.props;
    return (
      <React.Fragment>
        <TouchableTokenAmount
          containerStyle={[styles.flex4, styles.mv2, styles.mr2, styles.p0]}
          symbol={base.symbol}
          label={side === 'buy' ? 'Buying' : 'Selling'}
          amount={this.state.amount.join('')}
          cursor={this.state.focus === 'amount'}
          cursorProps={{ style: { marginLeft: 2 } }}
          format={false}
          onPress={this.selectAmountTokenAmount}
        />
        <TouchableTokenAmount
          containerStyle={[styles.flex4, styles.mv2, styles.mr2, styles.p0]}
          symbol={quote.symbol}
          label={'price'}
          amount={this.state.price.join('')}
          format={false}
          cursor={this.state.focus === 'price'}
          cursorProps={{ style: { marginLeft: 2 } }}
          onPress={this.selectPriceTokenAmount}
        />
        <SelectableCirclesRow
          labels={EXPIRATION_LABELS}
          selectedIndex={this.state.expirationIndex}
          onSelect={this.selectExpirationIndex}
        />
      </React.Fragment>
    );
  }

  selectExpirationIndex = expirationIndex => {
    this.setState({ expirationIndex });
  };

  selectAmountTokenAmount = () => {
    this.setState({ focus: 'amount' });
  };

  selectPriceTokenAmount = () => {
    this.setState({ focus: 'price' });
  };

  getButtonTitle() {
    const { focus } = this.state;
    const { side } = this.props;

    if (focus === 'price') {
      if (side === 'buy') {
        return 'Preview Buy Order';
      } else if (side === 'sell') {
        return 'Preview Sell Order';
      }
    } else if (focus === 'amount') {
      return 'Next';
    }

    return null;
  }

  getButtonIcon() {
    if (this.state.focus === 'amount') {
      return (
        <MaterialCommunityIcons
          name="arrow-collapse-right"
          color="white"
          size={15}
        />
      );
    }
  }

  getKeyboardProps() {
    return {
      decimal: this.state.amount.indexOf('.') === -1
    };
  }

  getButtonProps() {
    return {
      title: this.getButtonTitle(),
      icon: this.getButtonIcon(),
      iconRight: this.state.focus === 'amount'
    };
  }

  press() {
    if (this.state.focus === 'amount') {
      this.setState({ focus: 'price' });
    } else {
      this.submit();
    }
  }

  async submit() {
    const { side, quote, base } = this.props;
    const { amount, price, expirationIndex } = this.state;
    const amountString = amount.join('');
    const priceString = price.join('');

    if (!isValidAmount(amountString) || !amountString) {
      this.setState({ amountError: true });
      return;
    }

    if (!isValidAmount(priceString) || !priceString) {
      this.setState({ priceError: true });
      return;
    }

    const expirationTimeSeconds =
      Math.ceil(Date.now() / 1000) + EXPIRATION_VALUES[expirationIndex];
    let order;

    try {
      order = await createOrder({
        baseAddress: base.address,
        quoteAddress: quote.address,
        price: priceString,
        amount: amountString,
        side,
        expirationTimeSeconds
      });
    } catch (error) {
      this.props.navigation.showErrorModal(error);
      return;
    }

    this.props.navigation.showModal('modals.PreviewOrder', {
      type: 'limit',
      order,
      side,
      base,
      quote,
      callback: error => {
        if (error) {
          this.props.navigation.waitForAppear(() =>
            this.props.navigation.showErrorModal(error)
          );
        } else {
          this.props.navigation.pop();
        }
      }
    });
  }
}

export default connectNavigation(CreateLimitOrder);
