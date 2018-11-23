import { BigNumber } from '0x.js';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { InteractionManager, View } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { ZERO } from '../../../constants/0x';
import * as AssetService from '../../../services/AssetService';
import NavigationService from '../../../services/NavigationService';
import * as OrderService from '../../../services/OrderService';
import * as WalletService from '../../../services/WalletService';
import { colors, getProfitLossStyle } from '../../../styles';
import {
  batchMarketBuy,
  batchMarketBuyWithEth,
  batchMarketSell
} from '../../../thunks';
import Button from '../../components/Button';
import TwoColumnListItem from '../../components/TwoColumnListItem';
import FormattedTokenAmount from '../../components/FormattedTokenAmount';
import Row from '../../components/Row';
import Loading from './Loading';

class Order extends Component {
  static get propTypes() {
    return {
      limitOrder: PropTypes.object.isRequired,
      base: PropTypes.object.isRequired,
      quote: PropTypes.object.isRequired,
      highlight: PropTypes.bool
    };
  }

  render() {
    const { limitOrder, base, quote, highlight, ...rest } = this.props;
    const { amount, price } = limitOrder;

    return (
      <ListItem
        checkmark={highlight}
        title={
          <Row style={[{ flex: 1 }]}>
            <FormattedTokenAmount amount={amount} symbol={base.symbol} />
            <Text> priced at </Text>
            <FormattedTokenAmount amount={price} symbol={quote.symbol} />
          </Row>
        }
        bottomDivider
        {...rest}
      />
    );
  }
}

class PreviewFillOrders extends Component {
  static get propTypes() {
    return {
      side: PropTypes.string.isRequired,
      amount: PropTypes.string.isRequired,
      base: PropTypes.object.isRequired,
      quote: PropTypes.object.isRequired,
      dispatch: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      quote: null,
      loading: true
    };
  }

  componentDidMount() {
    const { side, amount, base } = this.props;
    const baseUnitAmount = Web3Wrapper.toBaseUnitAmount(
      new BigNumber(amount),
      base.decimals
    );

    InteractionManager.runAfterInteractions(async () => {
      try {
        let quote;

        if (side === 'buy') {
          quote = await OrderService.getBuyAssetsQuoteAsync(
            base.assetData,
            baseUnitAmount,
            {
              slippagePercentage: 0.2,
              expiryBufferSeconds: 30
            }
          );
        } else {
          quote = await OrderService.getSellAssetsQuoteAsync(
            base.assetData,
            baseUnitAmount,
            {
              slippagePercentage: 0.2,
              expiryBufferSeconds: 30
            }
          );
        }

        if (!quote) {
          NavigationService.goBack();
          return;
        }

        this.setState({ quote, loading: false });
      } catch (err) {
        NavigationService.goBack();
      }
    });
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    const receipt = this.getReceipt();

    if (!receipt) return null;

    const { quote } = this.state;
    const baseAsset = this.props.base;
    const quoteAsset = this.props.quote;

    const { priceAverage, subtotal, fee, total } = receipt;
    const funds = WalletService.getAdjustedBalanceByAddress(quoteAsset.address);
    const fundsAfterOrder = funds.add(total);

    return (
      <View style={{ width: '100%', height: '100%', flex: 1, marginTop: 50 }}>
        <TwoColumnListItem
          left="Average Price"
          leftStyle={{ height: 30 }}
          right={
            <FormattedTokenAmount
              amount={priceAverage}
              symbol={quoteAsset.symbol}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Sub-Total"
          leftStyle={{ height: 30 }}
          right={
            <FormattedTokenAmount
              amount={subtotal}
              symbol={quoteAsset.symbol}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Fee"
          leftStyle={{ height: 30 }}
          right={
            <FormattedTokenAmount
              amount={fee}
              symbol={quoteAsset.symbol}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Total"
          leftStyle={{ height: 30 }}
          right={
            <FormattedTokenAmount
              amount={total}
              symbol={quoteAsset.symbol}
              style={[styles.tokenAmountRight, getProfitLossStyle(total)]}
            />
          }
          rowStyle={{ marginTop: 10 }}
          bottomDivider={true}
          topDivider={true}
        />
        <TwoColumnListItem
          left="Funds Available"
          leftStyle={{ height: 30 }}
          right={
            <FormattedTokenAmount
              amount={funds}
              symbol={quoteAsset.symbol}
              style={[styles.tokenAmountRight]}
            />
          }
          rightStyle={{ height: 30 }}
          rowStyle={{ marginTop: 10 }}
          bottomDivider={true}
        />

        <TwoColumnListItem
          left="Funds After Filling Orders"
          leftStyle={{ height: 30 }}
          right={
            <FormattedTokenAmount
              amount={fundsAfterOrder}
              symbol={quoteAsset.symbol}
              style={[styles.tokenAmountRight, getProfitLossStyle(total)]}
            />
          }
          rightStyle={{ height: 30 }}
          rowStyle={{ marginTop: 10 }}
          bottomDivider={true}
        />
        <Button large onPress={this.submit} title={this.getButtonTitle()} />
        {quote.orders.map((o, i) => (
          <Order
            key={o.orderHash || o.hash || i}
            limitOrder={OrderService.convertZeroExOrderToLimitOrder(o)}
            base={baseAsset}
            quote={quoteAsset}
            highlight={true}
          />
        ))}
      </View>
    );
  }

  getButtonTitle = () => {
    const { side } = this.props;

    if (side === 'buy') {
      return 'Buy';
    } else {
      return 'Sell';
    }
  };

  getTotalFee = () => {
    return ZERO.toString();
  };

  getSubtotal = () => {
    const { side } = this.props;
    const { quote } = this.state;
    const asset = AssetService.findAssetByData(quote.assetData);
    let amount = null;
    if (side === 'buy') {
      amount = Web3Wrapper.toUnitAmount(quote.assetBuyAmount, asset.decimals)
        .mul(quote.bestCaseQuoteInfo.ethPerAssetPrice)
        .negated();
    } else {
      amount = Web3Wrapper.toUnitAmount(
        quote.assetSellAmount,
        asset.decimals
      ).mul(quote.bestCaseQuoteInfo.ethPerAssetPrice);
    }
    return amount.toString();
  };

  getTotal = () => {
    const { quote } = this.state;
    const subtotal = this.getSubtotal(quote);
    return subtotal.toString();
  };

  getFillAction = () => {
    const { side } = this.props;
    const { quote } = this.state;

    if (side === 'buy') {
      const asset = AssetService.findAssetByData(quote.assetData);
      const WETHAsset = AssetService.getWETHAsset();
      const balance = WalletService.getBalanceByAddress(WETHAsset.address);
      const amount = Web3Wrapper.toUnitAmount(
        quote.assetBuyAmount,
        asset.decimals
      );
      const quoteAmount = amount.mul(quote.worstCaseQuoteInfo.ethPerAssetPrice);
      if (quoteAmount.gt(balance)) {
        return batchMarketBuyWithEth;
      } else {
        return batchMarketBuy;
      }
    } else {
      return batchMarketSell;
    }
  };

  getReceipt = () => {
    const subtotal = this.getSubtotal();
    const total = this.getTotal();
    const fee = this.getTotalFee();
    const { quote } = this.state;

    if (!quote) {
      return null;
    }

    const priceAverage = OrderService.getAveragePrice(quote.orders);

    return {
      priceAverage,
      subtotal,
      fee,
      total
    };
  };

  submit = () => {
    const { quote } = this.state;
    const fillAction = this.getFillAction();

    NavigationService.navigate('SubmittingOrders', {
      action: () => this.props.dispatch(fillAction(quote)),
      next: 'List',
      text: 'Filling Orders'
    });
  };
}

export default connect(() => ({}), dispatch => ({ dispatch }))(
  PreviewFillOrders
);

const styles = {
  tokenAmountRight: {
    flex: 1,
    textAlign: 'right',
    height: 30,
    color: colors.primary
  }
};
