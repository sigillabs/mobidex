import * as _ from "lodash";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import NormalHeader from "../headers/Normal";
import { fillOrder, cancelOrder } from "../../thunks";
import { formatAmount, formatAmountWithDecimals } from "../../utils/display";
import { calculateBidPrice, calculateAskPrice } from "../../utils/orders";
import Button from "../components/Button";
import Row from "../components/Row";

class CancellableOrderDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nonce: null,
      tx: null,
      receipt: null
    };
  }

  cancelOrder = async () => {
    const { order } = this.props;
    this.props.dispatch(cancelOrder(order));
  };

  render() {
    const { tokens, quoteToken, baseToken, address, order } = this.props;
    const isMine = order.maker === address;
    const orderType = quoteToken.address === order.makerTokenAddress ? "bid" : "ask";
    let amount = null;
    let amountSymbol = null;
    let amountDecimals = null;
    let price = null;
    let priceSymbol = null;
    let priceDecimals = null;
    let subtotal = null;

    switch(orderType) {
      case "bid":
      amount = order.takerTokenAmount;
      amountSymbol = _.find(tokens, { address: order.takerTokenAddress }).symbol;
      amountDecimals = _.find(tokens, { address: order.takerTokenAddress }).decimals;
      price = calculateBidPrice(order, quoteToken, baseToken);
      priceSymbol = _.find(tokens, { address: order.makerTokenAddress }).symbol;
      priceDecimals = _.find(tokens, { address: order.makerTokenAddress }).decimals;
      subtotal = order.makerTokenAmount;
      break;

      case "ask":
      amount = order.makerTokenAmount;
      amountSymbol = _.find(tokens, { address: order.makerTokenAddress }).symbol;
      amountDecimals = _.find(tokens, { address: order.makerTokenAddress }).decimals;
      price = calculateAskPrice(order, quoteToken, baseToken);
      priceSymbol = _.find(tokens, { address: order.takerTokenAddress }).symbol;
      priceDecimals = _.find(tokens, { address: order.takerTokenAddress }).decimals;
      subtotal = order.takerTokenAmount;
      break;
    }

    let title = `${orderType === "ask" ? "Buy" : "Sell"} ${formatAmountWithDecimals(amount, amountDecimals)} ${amountSymbol}`;

    return (
      <Card title={title}>
        <Row>
          <Text>Price:</Text>
          <Text> </Text>
          <Text>{formatAmount(price)} {priceSymbol}</Text>
        </Row>
        <Row>
          <Text>Amount:</Text>
          <Text> </Text>
          <Text>{formatAmountWithDecimals(amount, amountDecimals)} {amountSymbol}</Text>
        </Row>
        <Row>
          <Text>Subtotal:</Text>
          <Text> </Text>
          <Text>{formatAmountWithDecimals(subtotal, priceDecimals)} {priceSymbol}</Text>
        </Row>
        <Row>
          <Text>Fees:</Text>
          <Text> </Text>
          <Text>0 ZRX</Text>
        </Row>
        <Row>
          <Text>Total:</Text>
          <Text> </Text>
          <Text>{formatAmountWithDecimals(subtotal, priceDecimals)} {priceSymbol}</Text>
        </Row>

        <Button
            large
            icon={<Icon name="cancel" size={20} color="white" />}
            onPress={this.cancelOrder}
            text="Cancel Order"
            style={{ marginTop: 10 }} />
      </Card>
    );
  }
}

export default connect(state => ({ ...state.device, ...state.settings, ...state.wallet, ...state.relayer }), dispatch => ({ dispatch }))(CancellableOrderDetails);
