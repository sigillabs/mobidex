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
import * as ZeroExService from '../../../services/ZeroExService';
import { colors, getProfitLossStyle } from '../../../styles';
import { batchMarketBuy, batchMarketSell } from '../../../thunks';
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
      web3: PropTypes.object.isRequired,
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
      gas: 0,
      gasPrice: 0,
      loading: true,
      quote: null
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
        let quote, gas;

        // 1. Load quote
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

        // 2. Load gas estimatation
        if (side === 'buy') {
          gas = await ZeroExService.estimateMarketBuyOrders(
            quote.orders,
            quote.assetBuyAmount
          );
        } else {
          gas = await ZeroExService.estimateMarketSellOrders(
            quote.orders,
            quote.assetSellAmount
          );
        }

        // 3. Load gas price
        const gasPrice = await WalletService.getGasPrice();

        this.setState({
          quote,
          gas,
          gasPrice,
          loading: false
        });
      } catch (err) {
        console.warn(err.message, err);
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

    const { gas, gasPrice, quote } = this.state;
    const { web3 } = this.props;
    const baseAsset = this.props.base;
    const quoteAsset = this.props.quote;

    const { priceAverage, subtotal, fee, total } = receipt;
    const funds = WalletService.getAdjustedBalanceByAddress(quoteAsset.address);
    const fundsAfterOrder = funds.add(total);

    const priceInWEI = web3.utils.toWei(gasPrice.toString());
    const priceInGWEI = web3.utils.fromWei(priceInWEI, 'gwei');

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
          bottomDivider={true}
        />
        <TwoColumnListItem
          left="Gas Price"
          leftStyle={{ height: 30 }}
          right={
            <FormattedTokenAmount
              amount={priceInGWEI}
              symbol={'GWEI'}
              style={[styles.tokenAmountRight]}
            />
          }
          rowStyle={{ marginTop: 10 }}
          topDivider={true}
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Total Gas Cost"
          leftStyle={{ height: 30 }}
          right={
            <FormattedTokenAmount
              amount={gasPrice.mul(gas)}
              symbol={'ETH'}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={true}
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

    if (side === 'buy') {
      return batchMarketBuy;
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

export default connect(
  ({ wallet: { web3 } }) => ({ web3 }),
  dispatch => ({ dispatch })
)(PreviewFillOrders);

const styles = {
  tokenAmountRight: {
    flex: 1,
    textAlign: 'right',
    height: 30,
    color: colors.primary
  }
};
