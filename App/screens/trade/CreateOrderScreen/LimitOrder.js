import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { ScrollView, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect as connectNavigation } from '../../../../navigation';
import { styles } from '../../../../styles';
import { navigationProp } from '../../../../types/props';
import {
  isValidAmount,
  processVirtualKeyboardCharacter
} from '../../../../utils';
import SelectableCirclesRow from '../../../components/SelectableCirclesRow';
import TouchableTokenAmount from '../../../components/TouchableTokenAmount';
import TokenAmountKeyboard from '../../../components/TokenAmountKeyboard';
import { createOrder } from '../../../../services/OrderService';

const EXPIRATION_LABELS = ['1 min', '1 hour', '1 day', '1 mon', '1 year'];
const EXPIRATION_VALUES = [
  60,
  60 * 60,
  24 * 60 * 60,
  30 * 24 * 60 * 60,
  365 * 24 * 60 * 60
];

class CreateLimitOrder extends Component {
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
      amount: '',
      amountError: false,
      price: '',
      priceError: false,
      focus: 'amount',
      expirationIndex: 2
    };
  }

  render() {
    const { side, quote, base } = this.props;

    if (side !== 'buy' && side !== 'sell') {
      this.props.navigation.pop();
    }

    return (
      <View style={[styles.flex1]}>
        <View style={[styles.flex1, styles.fluff0, styles.w100]}>
          <ScrollView contentContainerStyle={[styles.flex0, styles.p3]}>
            <TouchableTokenAmount
              containerStyle={[styles.flex4, styles.mv2, styles.mr2, styles.p0]}
              symbol={base.symbol}
              label={side === 'buy' ? 'Buying' : 'Selling'}
              amount={this.state.amount.toString()}
              cursor={this.state.focus === 'amount'}
              cursorProps={{ style: { marginLeft: 2 } }}
              format={false}
              onPress={this.selectAmountTokenAmount}
            />
            <TouchableTokenAmount
              containerStyle={[styles.flex4, styles.mv2, styles.mr2, styles.p0]}
              symbol={quote.symbol}
              label={'price'}
              amount={this.state.price.toString()}
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
          </ScrollView>
        </View>
        <View style={[styles.flex0, styles.fluff0]}>
          <TokenAmountKeyboard
            onChange={c => this.onSetValue(this.state.focus, c)}
            onSubmit={() =>
              this.state.focus === 'amount'
                ? this.setState({ focus: 'price' })
                : this.submit()
            }
            pressMode="char"
            buttonTitle={this.getButtonTitle()}
            buttonIcon={this.getButtonIcon()}
            buttonIconRight={this.getButtonIconRight()}
          />
        </View>
      </View>
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

  getButtonIconRight() {
    return this.state.focus === 'amount';
  }

  onSetValue(column, value) {
    const errorColumn = `${column}Error`;
    const text = processVirtualKeyboardCharacter(
      value,
      this.state[column].toString()
    );

    if (isValidAmount(text)) {
      this.setState({ [column]: text, [errorColumn]: false });
    } else {
      this.setState({ [errorColumn]: true });
    }
  }

  async submit() {
    const { side, quote, base } = this.props;
    const { amount, price, expirationIndex } = this.state;

    if (!isValidAmount(amount) || !amount) {
      this.setState({ amountError: true });
      return;
    }

    if (!isValidAmount(price) || !price) {
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
        price,
        amount,
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
