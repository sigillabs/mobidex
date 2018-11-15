import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import * as AssetService from '../../../../services/AssetService';
import NavigationService from '../../../../services/NavigationService';
import * as OrderService from '../../../../services/OrderService';
import { getAdjustedBalanceByAddress } from '../../../../services/WalletService';
import { colors, getProfitLossStyle } from '../../../../styles';
import Button from '../../../components/Button';
import TwoColumnListItem from '../../../components/TwoColumnListItem';
import FormattedTokenAmount from '../../../components/FormattedTokenAmount';
import Row from '../../../components/Row';

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

class BasePreviewFillOrders extends Component {
  static get propTypes() {
    return {
      buttonTitle: PropTypes.string.isRequired,
      quote: PropTypes.object.isRequired,
      subtotal: PropTypes.string.isRequired,
      fee: PropTypes.string.isRequired,
      total: PropTypes.string.isRequired,
      fillAction: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired
    };
  }

  render() {
    const receipt = this.getReceipt();

    if (!receipt) return null;

    const { buttonTitle, quote } = this.props;
    const quoteAsset = AssetService.getQuoteAsset();
    const baseAsset = AssetService.findAssetByData(quote.assetData);

    const { priceAverage, subtotal, fee, total } = receipt;
    const funds = getAdjustedBalanceByAddress(quoteAsset.address);
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
              style={[
                styles.tokenAmountRight,
                getProfitLossStyle(total.toNumber())
              ]}
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
              style={[
                styles.tokenAmountRight,
                getProfitLossStyle(total.toNumber())
              ]}
            />
          }
          rightStyle={{ height: 30 }}
          rowStyle={{ marginTop: 10 }}
          bottomDivider={true}
        />
        <Button large onPress={() => this.submit()} title={buttonTitle} />
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

  getReceipt() {
    const { quote, subtotal, fee, total } = this.props;

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
  }

  submit() {
    const { fillAction, quote } = this.props;

    NavigationService.navigate('SubmittingOrders', {
      action: () => this.props.dispatch(fillAction(quote)),
      next: 'List',
      text: 'Filling Orders'
    });
  }
}

export default connect(() => ({}), dispatch => ({ dispatch }))(
  BasePreviewFillOrders
);

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
