import { BigNumber } from '0x.js';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { InteractionManager, View } from 'react-native';
import { connect } from 'react-redux';
import NavigationService from '../../../../services/NavigationService';
import * as styles from '../../../../styles';
import { loadMarketBuyQuote } from '../../../../thunks';
import {
  isValidAmount,
  processVirtualKeyboardCharacter
} from '../../../../utils';
import MutedText from '../../../components/MutedText';
import TokenAmountKeyboard from '../../../components/TokenAmountKeyboard';
import TokenBuyQuoteAmount from '../../../views/TokenBuyQuoteAmount';
import TokenBuyQuoteError from '../../../views/TokenBuyQuoteError';

class FillAsks extends Component {
  static get propTypes() {
    return {
      quote: PropTypes.object,
      quoteLoading: PropTypes.bool,
      quoteError: PropTypes.object,
      baseToken: PropTypes.object.isRequired,
      quoteToken: PropTypes.object.isRequired,
      dispatch: PropTypes.func.isRequired
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
      const { baseToken } = this.props;
      const baseUnitAmount = Web3Wrapper.toBaseUnitAmount(
        new BigNumber(amount || 0),
        baseToken.decimals
      );
      InteractionManager.runAfterInteractions(async () => {
        try {
          await this.props.dispatch(
            loadMarketBuyQuote(baseToken.assetData, baseUnitAmount, {
              slippagePercentage: 0.2,
              expiryBufferSeconds: 30,
              filterInvalidOrders: false
            })
          );
        } catch (err) {
          this.setState({ amountError: err });
        }
      });
    }, 500);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { quote, quoteLoading } = this.props;
    const { amount, amountError } = this.state;

    if (nextState.amount !== amount) {
      return true;
    }

    if (nextState.amountError !== amountError) {
      return true;
    }

    if (nextProps.quote !== quote) {
      return true;
    }

    if (nextProps.quoteLoading !== quoteLoading) {
      return true;
    }

    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    const { amount } = this.state;
    if (prevState.amount !== amount) {
      this.loadQuote();
    }
  }

  render() {
    const { quote, quoteLoading, quoteError } = this.props;
    const isEmptyQuote = !quote || quote.orders.length === 0;

    return (
      <View style={{ width: '100%', height: '100%' }}>
        <TokenBuyQuoteAmount
          containerStyle={{ marginTop: 10, marginBottom: 10, padding: 0 }}
          amount={this.state.amount.toString()}
          cursor={true}
          cursorProps={{ style: { marginLeft: 2 } }}
          format={false}
        />
        <TokenAmountKeyboard
          onChange={this.onSetAmount}
          onSubmit={this.preview}
          pressMode="char"
          buttonTitle={'Preview Buy Orders'}
          buttonLoading={quoteLoading}
          disableButton={isEmptyQuote}
        />
        {isEmptyQuote && !quoteError && !quoteLoading ? (
          <MutedText
            style={[styles.flex1, styles.row, styles.center, styles.textcenter]}
          >
            There are no orders to fill.
          </MutedText>
        ) : null}
        <TokenBuyQuoteError
          style={[styles.flex1, styles.row, styles.center, styles.textcenter]}
        />
      </View>
    );
  }

  preview = () => {
    const { amount } = this.state;
    const baseAssetData = this.props.baseToken.assetData;
    const quoteAssetData = this.props.quoteToken.assetData;

    if (isValidAmount(amount)) {
      NavigationService.navigate('PreviewOrders', {
        type: 'fill',
        side: 'buy',
        amount,
        baseAssetData,
        quoteAssetData
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
    } else {
      this.setState({ amountError: true });
    }
  };
}

export default connect(
  ({
    quote: {
      buy: { quote, loading, error }
    }
  }) => ({ quote, quoteLoading: loading, quoteError: error }),
  dispatch => ({ dispatch })
)(FillAsks);
