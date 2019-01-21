import { BigNumber } from '0x.js';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { InteractionManager, SafeAreaView } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import { ZERO } from '../../../constants/0x';
import { connect as connectNavigation } from '../../../navigation';
import * as AssetService from '../../../services/AssetService';
import * as OrderService from '../../../services/OrderService';
import * as WalletService from '../../../services/WalletService';
import * as ZeroExService from '../../../services/ZeroExService';
import { colors, getProfitLossStyle } from '../../../styles';
import {
  ActionErrorSuccessFlow,
  loadOrderbook,
  marketBuy,
  marketSell
} from '../../../thunks';
import { navigationProp } from '../../../types/props';
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
            <FormattedTokenAmount amount={amount} assetData={base.assetData} />
            <Text> priced at </Text>
            <FormattedTokenAmount amount={price} assetData={quote.assetData} />
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
      navigation: navigationProp.isRequired,
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
      quote: null,
      takerFee: null
    };
  }

  componentDidMount() {
    const { side, amount } = this.props;
    const feeAsset = AssetService.getFeeAsset();
    const baseUnitAmount = Web3Wrapper.toBaseUnitAmount(
      new BigNumber(amount),
      this.props.base.decimals
    );

    InteractionManager.runAfterInteractions(async () => {
      let quote, gas, fillResults;

      // 1. Reload orderbook, balance, and allowance.
      try {
        await this.props.dispatch(
          loadOrderbook(this.props.base.assetData, this.props.quote.assetData)
        );
      } catch (err) {
        this.props.navigation.dismissModal();
        this.props.navigation.waitForDisappear(() =>
          this.props.navigation.showErrorModal(err)
        );
        return;
      }

      // 2. Load quote
      try {
        if (side === 'buy') {
          quote = await OrderService.getBuyAssetsQuoteAsync(
            this.props.base.assetData,
            baseUnitAmount,
            {
              slippagePercentage: 0.2,
              expiryBufferSeconds: 30
            }
          );
        } else {
          quote = await OrderService.getSellAssetsQuoteAsync(
            this.props.base.assetData,
            baseUnitAmount,
            {
              slippagePercentage: 0.2,
              expiryBufferSeconds: 30
            }
          );
        }
      } catch (err) {
        this.props.navigation.dismissModal();
        this.props.navigation.waitForDisappear(() =>
          this.props.navigation.showErrorModal(err)
        );
        return;
      }

      if (!quote) {
        this.props.navigation.dismissModal();
        return;
      }

      // 3. Verify assets
      try {
        if (side === 'buy') {
          fillResults = await ZeroExService.validateMarketBuyOrders(
            quote.orders,
            quote.assetBuyAmount
          );
        } else {
          fillResults = await ZeroExService.validateMarketSellOrders(
            quote.orders,
            quote.assetSellAmount
          );
        }
      } catch (err) {
        this.props.navigation.dismissModal();
        this.props.navigation.waitForDisappear(() =>
          this.props.navigation.showErrorModal(err)
        );
        return;
      }

      // 4. Load gas estimatation
      try {
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
      } catch (err) {
        this.props.navigation.dismissModal();
        this.props.navigation.waitForDisappear(() =>
          this.props.navigation.showErrorModal(err)
        );
        return;
      }

      // 5. Load gas price
      const gasPrice = await WalletService.getGasPriceInEth();

      const takerFee = Web3Wrapper.toUnitAmount(
        fillResults.takerFeePaid,
        feeAsset.decimals
      );

      this.setState({
        quote,
        gas,
        gasPrice,
        takerFee,
        loading: false
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    const receipt = this.getReceipt();

    if (!receipt) return null;

    const web3 = WalletService.getWeb3();
    const { gas, gasPrice, quote, takerFee } = this.state;
    const { side } = this.props;
    const baseAsset = this.props.base;
    const quoteAsset = this.props.quote;
    const feeAsset = AssetService.getFeeAsset();
    const networkFeeAsset = AssetService.getNetworkFeeAsset();

    const { priceAverage, subtotal, fee, total } = receipt;
    const funds = WalletService.getBalanceByAddress(quoteAsset.address);
    const fundsAfterOrder =
      side === 'buy' ? funds.sub(total) : funds.add(total);
    const feeFunds = WalletService.getAdjustedBalanceByAddress(
      feeAsset.address
    );
    const feeFundsAfterOrder = feeFunds.sub(fee);

    const priceInWEI = web3.utils.toWei(gasPrice.toString());
    const priceInGWEI = web3.utils.fromWei(priceInWEI, 'gwei');

    return (
      <SafeAreaView
        style={{ width: '100%', height: '100%', flex: 1, marginTop: 50 }}
      >
        <TwoColumnListItem
          left="Average Price"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={priceAverage}
              assetData={quoteAsset.assetData}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Sub-Total"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={subtotal}
              assetData={quoteAsset.assetData}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Fee"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={takerFee}
              assetData={feeAsset.assetData}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Maximum Fee"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={fee}
              assetData={feeAsset.assetData}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={true}
        />
        <TwoColumnListItem
          left="Gas Price"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={priceInGWEI}
              assetData={networkFeeAsset.assetData}
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
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={this.getTotalGasCost()}
              assetData={networkFeeAsset.assetData}
              symbol={'ETH'}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={true}
        />
        <TwoColumnListItem
          left="Total"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={total}
              assetData={quoteAsset.assetData}
              style={[
                styles.tokenAmountRight,
                getProfitLossStyle(side === 'buy' ? -1 : 1)
              ]}
            />
          }
          rowStyle={{ marginTop: 10 }}
          bottomDivider={true}
          topDivider={true}
        />
        <TwoColumnListItem
          left="Funds Available"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={funds}
              assetData={quoteAsset.assetData}
              style={[styles.tokenAmountRight]}
            />
          }
          rowStyle={{ marginTop: 10 }}
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Fee Funds Available"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={feeFunds}
              assetData={feeAsset.assetData}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={true}
        />
        <TwoColumnListItem
          left="Funds After Filling Orders"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={fundsAfterOrder}
              assetData={quoteAsset.assetData}
              style={[
                styles.tokenAmountRight,
                getProfitLossStyle(side === 'buy' ? -1 : 1)
              ]}
            />
          }
          rowStyle={{ marginTop: 10 }}
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Fee Funds After Filling Orders"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={feeFundsAfterOrder}
              assetData={feeAsset.assetData}
              style={[
                styles.tokenAmountRight,
                getProfitLossStyle(fee.gt(0) ? -1 : 0)
              ]}
            />
          }
          bottomDivider={true}
        />
        <Row style={{ width: '100%' }}>
          <Button
            large
            onPress={this.cancel}
            title={'Cancel'}
            containerStyle={{ flex: 1 }}
          />
          <Button
            large
            onPress={this.submit}
            title={this.getButtonTitle()}
            containerStyle={{ flex: 1 }}
          />
        </Row>
        {quote.orders.map((o, i) => (
          <Order
            key={o.orderHash || o.hash || i}
            limitOrder={OrderService.convertZeroExOrderToLimitOrder(o)}
            base={baseAsset}
            quote={quoteAsset}
            highlight={true}
          />
        ))}
      </SafeAreaView>
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

  getMaxFee = () => {
    const asset = AssetService.getFeeAsset();
    const fee = this.state.quote.orders
      .map(o => o.takerFee)
      .reduce((total, fee) => total.add(fee), ZERO);
    return Web3Wrapper.toUnitAmount(fee, asset.decimals);
  };

  getTotalGasCost = () => {
    const { gasPrice, gas } = this.state;
    return gasPrice.mul(gas).toString();
  };

  getSubtotal = () => {
    const { side } = this.props;
    const { quote } = this.state;
    const asset = AssetService.findAssetByData(quote.assetData);
    let amount = null;
    if (side === 'buy') {
      amount = Web3Wrapper.toUnitAmount(
        quote.assetBuyAmount,
        asset.decimals
      ).mul(quote.bestCaseQuoteInfo.ethPerAssetPrice);
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
    const gas = this.getTotalGasCost();
    return new BigNumber(subtotal).add(gas).toString();
  };

  getFillAction = () => {
    const { side } = this.props;

    if (side === 'buy') {
      return marketBuy;
    } else {
      return marketSell;
    }
  };

  getReceipt = () => {
    const subtotal = this.getSubtotal();
    const total = this.getTotal();
    const fee = this.getMaxFee();
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

  cancel = () => this.props.navigation.dismissModal();

  submit = () => {
    const { quote } = this.state;
    const fillAction = this.getFillAction();

    this.props.dispatch(
      ActionErrorSuccessFlow(
        this.props.navigation.componentId,
        {
          action: async () => this.props.dispatch(fillAction(quote)),
          icon: <Entypo name="chevron-with-circle-up" size={100} />,
          label: 'Filling Orders...'
        },
        'Filled Orders',
        () => this.props.navigation.dismissModal()
      )
    );
  };
}

export default connect(
  ({ wallet: { web3 } }) => ({ web3 }),
  dispatch => ({ dispatch })
)(connectNavigation(PreviewFillOrders));

const styles = {
  tokenAmountLeft: {
    color: colors.primary,
    height: 30
  },
  tokenAmountRight: {
    flex: 1,
    textAlign: 'right',
    height: 30,
    color: colors.primary
  }
};
