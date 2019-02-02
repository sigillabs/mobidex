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
  marketSell,
  refreshGasPrice
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
      gasPrice: PropTypes.instanceOf(BigNumber),
      dispatch: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      gas: 0,
      loading: true,
      quote: null
    };
  }

  componentDidMount() {
    const { side, amount } = this.props;
    const feeAsset = AssetService.getFeeAsset();
    const networkFeeAsset = AssetService.getNetworkFeeAsset();
    const etherBalance = WalletService.getBalanceByAssetData(
      networkFeeAsset.assetData
    );
    const feeBalance = WalletService.getBalanceByAssetData(feeAsset.assetData);
    const quoteBalance = WalletService.getBalanceByAssetData(
      this.props.quote.assetData
    );
    const baseBalance = WalletService.getBalanceByAssetData(
      this.props.base.assetData
    );
    const baseUnitAmount = Web3Wrapper.toBaseUnitAmount(
      new BigNumber(amount),
      this.props.base.decimals
    );

    InteractionManager.runAfterInteractions(async () => {
      let quote, gas;

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

      // 3. Verify orders
      //// - Check fee balance
      //// - Check taker balance
      if (side === 'buy') {
        const unit = Web3Wrapper.toUnitAmount(
          quote.assetSellAmount,
          this.props.quote.decimals
        );
        if (unit.gt(quoteBalance)) {
          this.props.navigation.dismissModal();
          this.props.navigation.waitForDisappear(() =>
            this.props.navigation.showErrorModal(
              new Error(
                `Not enough ${
                  this.props.quote.symbol
                }. You have ${quoteBalance.toString()}, but need ${unit.toString()}.`
              )
            )
          );
          return;
        }
      } else {
        const unit = Web3Wrapper.toUnitAmount(
          quote.assetSellAmount,
          this.props.base.decimals
        );
        if (unit.gt(baseBalance)) {
          this.props.navigation.dismissModal();
          this.props.navigation.waitForDisappear(() =>
            this.props.navigation.showErrorModal(
              new Error(
                `Not enough ${
                  this.props.base.symbol
                }. You have ${baseBalance.toString()}, but need ${unit.toString()}.`
              )
            )
          );
          return;
        }
      }

      const unitFee = Web3Wrapper.toUnitAmount(
        quote.bestCaseQuoteInfo.fee,
        feeAsset.decimals
      );
      if (unitFee.gt(feeBalance)) {
        this.props.navigation.dismissModal();
        this.props.navigation.waitForDisappear(() =>
          this.props.navigation.showErrorModal(
            new Error(
              `Not enough ZRX to pay the relayer fees. You have ${feeBalance.toString()}, but need ${unitFee.toString()}.`
            )
          )
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
      const gasPrice = WalletService.convertGasPriceToEth(
        await this.props.dispatch(refreshGasPrice())
      );

      // 6. Verify network fee
      if (gasPrice.mul(gas).gt(etherBalance)) {
        this.props.navigation.dismissModal();
        this.props.navigation.waitForDisappear(() =>
          this.props.navigation.showErrorModal(
            new Error('Not enough ETH to pay network fee.')
          )
        );
        return;
      }

      this.setState({
        quote,
        gas,
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
    const { gas, quote } = this.state;
    const { gasPrice, side } = this.props;
    const baseAsset = this.props.base;
    const quoteAsset = this.props.quote;
    const feeAsset = AssetService.getFeeAsset();
    const networkFeeAsset = AssetService.getNetworkFeeAsset();

    const {
      amount,
      payment,
      priceAverage,
      maxFee,
      networkFee,
      takerFee
    } = receipt;
    const networkFeeInETH = web3.utils.fromWei(networkFee.toString());
    const funds = WalletService.getBalanceByAddress(quoteAsset.address);
    const fundsAfterOrder =
      side === 'buy' ? funds.sub(payment) : funds.add(payment);
    const feeFunds = WalletService.getBalanceByAddress(feeAsset.address);
    const feeFundsAfterOrder = feeFunds.sub(takerFee);
    const networkFeeFunds = WalletService.getBalanceByAddress(
      networkFeeAsset.assetData
    );
    const networkFeeFundsAfterOrder = networkFeeFunds.sub(networkFeeInETH);

    const priceInGWEI = web3.utils.fromWei(gasPrice.toString(), 'gwei');

    return (
      <SafeAreaView
        style={{ width: '100%', height: '100%', flex: 1, marginTop: 50 }}
      >
        <TwoColumnListItem
          left="Amount"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={amount}
              assetData={quote.assetData}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={false}
        />
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
              amount={maxFee}
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
              amount={networkFeeInETH}
              assetData={networkFeeAsset.assetData}
              symbol={'ETH'}
              style={[styles.tokenAmountRight]}
            />
          }
          bottomDivider={true}
        />
        <TwoColumnListItem
          left="Payment Amount"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={payment}
              assetData={quoteAsset.assetData}
              style={[styles.tokenAmountRight]}
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
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Network Fee Funds Available"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={networkFeeFunds}
              assetData={networkFeeAsset.assetData}
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
                getProfitLossStyle(takerFee.gt(0) ? -1 : 0)
              ]}
            />
          }
          bottomDivider={false}
        />
        <TwoColumnListItem
          left="Network Fee Funds After Filling Orders"
          leftStyle={[styles.tokenAmountLeft]}
          right={
            <FormattedTokenAmount
              amount={networkFeeFundsAfterOrder}
              assetData={networkFeeAsset.assetData}
              style={[styles.tokenAmountRight]}
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

  getAmount = () => {
    const { side } = this.props;
    const { quote } = this.state;
    const asset = AssetService.findAssetByData(quote.assetData);
    if (side === 'buy') {
      return Web3Wrapper.toUnitAmount(quote.assetBuyAmount, asset.decimals);
    } else {
      return Web3Wrapper.toUnitAmount(quote.assetSellAmount, asset.decimals);
    }
  };

  getMaxFee = () => {
    const asset = AssetService.getFeeAsset();
    const fee = this.state.quote.orders
      .map(o => o.takerFee)
      .reduce((total, fee) => total.add(fee), ZERO);
    return Web3Wrapper.toUnitAmount(fee, asset.decimals);
  };

  getFee = () => {
    const asset = AssetService.getFeeAsset();
    return Web3Wrapper.toUnitAmount(
      this.state.quote.worstCaseQuoteInfo.fee,
      asset.decimals
    );
  };

  getTotalGasCost = () => {
    const { gasPrice } = this.props;
    const { gas } = this.state;
    return gasPrice.mul(gas).toString();
  };

  getPayment = () => {
    const { side } = this.props;
    const { quote } = this.state;
    const asset = AssetService.findAssetByData(quote.assetData);
    if (side === 'buy') {
      return Web3Wrapper.toUnitAmount(quote.assetBuyAmount, asset.decimals).mul(
        quote.bestCaseQuoteInfo.ethPerAssetPrice
      );
    } else {
      return Web3Wrapper.toUnitAmount(
        quote.assetSellAmount,
        asset.decimals
      ).mul(quote.bestCaseQuoteInfo.ethPerAssetPrice);
    }
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
    const { quote } = this.state;

    if (!quote) {
      return null;
    }

    const amount = this.getAmount();
    const payment = this.getPayment();
    const maxFee = this.getMaxFee();
    const takerFee = this.getFee();
    const networkFee = this.getTotalGasCost();
    const priceAverage = OrderService.getAveragePrice(quote.orders);

    return {
      amount,
      payment,
      priceAverage,
      maxFee,
      networkFee,
      takerFee
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
  ({ wallet: { web3 }, settings: { gasPrice } }) => ({ web3, gasPrice }),
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
