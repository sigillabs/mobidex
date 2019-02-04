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
import { colors } from '../../../styles';
import {
  ActionErrorSuccessFlow,
  loadOrderbook,
  marketBuy,
  marketSell,
  refreshGasPrice
} from '../../../thunks';
import { formatAmount } from '../../../utils';
import { navigationProp } from '../../../types/props';
import Button from '../../components/Button';
import FormattedTokenAmount from '../../components/FormattedTokenAmount';
import Row from '../../components/Row';
import Receipt from '../../views/Receipt';
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
    const relayerFeeAsset = AssetService.getFeeAsset();
    const networkrelayerFeeAsset = AssetService.getNetworkFeeAsset();
    const etherBalance = WalletService.getBalanceByAssetData(
      networkrelayerFeeAsset.assetData
    );
    const feeBalance = WalletService.getBalanceByAssetData(
      relayerFeeAsset.assetData
    );
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
        relayerFeeAsset.decimals
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

    const { quote } = this.state;
    const { side } = this.props;
    const baseAsset = this.props.base;
    const quoteAsset = this.props.quote;
    const relayerFeeAsset = AssetService.getFeeAsset();

    const { amount, payment, priceAverage, relayerFee } = receipt;
    const quoteFunds = WalletService.getBalanceByAddress(quoteAsset.address);
    const baseFunds = WalletService.getBalanceByAddress(baseAsset.address);
    const quoteFundsAfterOrder =
      side === 'buy' ? quoteFunds.sub(payment) : quoteFunds.add(payment);
    const baseFundsAfterOrder =
      side === 'buy' ? baseFunds.add(amount) : baseFunds.sub(amount);
    const relayerFeeFunds = WalletService.getBalanceByAddress(
      relayerFeeAsset.address
    );
    const relayerFeeFundsAfterOrder = relayerFeeFunds.sub(relayerFee);

    const extraWalletData = [
      {
        denomination: quoteAsset.symbol,
        value: formatAmount(quoteFunds, 9)
      },
      {
        denomination: baseAsset.symbol,
        value: formatAmount(baseFunds, 9)
      },
      {
        denomination: relayerFeeAsset.symbol,
        value: formatAmount(relayerFeeFunds, 9)
      }
    ];
    const extraUpdatedWalletData = [
      {
        denomination: quoteAsset.symbol,
        value: formatAmount(quoteFundsAfterOrder, 9),
        profit: side === 'sell',
        loss: side === 'buy'
      },
      {
        denomination: baseAsset.symbol,
        value: formatAmount(baseFundsAfterOrder, 9),
        profit: side === 'buy',
        loss: side === 'sell'
      },
      {
        denomination: relayerFeeAsset.symbol,
        value: formatAmount(relayerFeeFundsAfterOrder, 9),
        loss: relayerFee.gt(0)
      }
    ];
    const extraSections = [
      {
        title: 'Relayer',
        data: [
          {
            name: 'Trade Fees',
            value: formatAmount(relayerFee, 9),
            denomination: relayerFeeAsset.symbol,
            loss: relayerFee.gt(0)
          }
        ]
      },
      {
        title: 'Order',
        data: [
          {
            name: 'Side',
            value: side
          },
          {
            name: 'Average Price',
            value: formatAmount(priceAverage, 9),
            denomination: quoteAsset.symbol
          },
          {
            name: 'Sending',
            value: formatAmount(side === 'buy' ? payment : amount, 9),
            denomination: side === 'buy' ? quoteAsset.symbol : baseAsset.symbol,
            loss: true
          },
          {
            name: 'Receiving',
            value: formatAmount(side === 'buy' ? amount : payment, 9),
            denomination: side === 'buy' ? baseAsset.symbol : quoteAsset.symbol,
            profit: true
          }
        ]
      }
    ];

    return (
      <SafeAreaView style={[styles.flex1]}>
        <Receipt
          gas={this.state.gas}
          extraWalletData={extraWalletData}
          extraUpdatedWalletData={extraUpdatedWalletData}
          extraSections={extraSections}
        />
        <Row style={[styles.flex0]}>
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

  getFillAction = () => {
    const { side } = this.props;

    if (side === 'buy') {
      return marketBuy;
    } else {
      return marketSell;
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
      .map(o => o.relayerFee)
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

  getReceipt = () => {
    const { quote } = this.state;

    if (!quote) {
      return null;
    }

    const amount = this.getAmount();
    const payment = this.getPayment();
    const relayerFee = this.getFee();
    const priceAverage = OrderService.getAveragePrice(quote.orders);

    return {
      amount,
      payment,
      priceAverage,
      relayerFee
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
