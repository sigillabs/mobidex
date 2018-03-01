import * as _ from "lodash";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import NormalHeader from "../headers/Normal";
import { fillOrder, cancelOrder } from "../../thunks";
import { formatAmount, formatAmountWithDecimals } from "../../utils/display";

class OrderDetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: <NormalHeader navigation={navigation} />
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      nonce: null,
      tx: null,
      receipt: null
    };
  }

  fillOrder = async () => {
    const { web3, address } = this.props;
    const { navigation: { state: { params: { order } } } } = this.props;
    
    this.props.dispatch(fillOrder(order));
  };

  cancelOrder = async () => {
    const { navigation: { state: { params: { order } } } } = this.props;
    
    this.props.dispatch(cancelOrder(order));
  };

  render() {
    const { navigation: { state: { params: { order, quoteToken } } } } = this.props;
    const { tokens, address } = this.props;
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
      price = order.takerTokenAmount.div(order.makerTokenAmount);
      priceSymbol = _.find(tokens, { address: order.makerTokenAddress }).symbol;
      priceDecimals = _.find(tokens, { address: order.makerTokenAddress }).decimals;
      subtotal = order.makerTokenAmount;
      break;

      case "ask":
      amount = order.makerTokenAmount;
      amountSymbol = _.find(tokens, { address: order.makerTokenAddress }).symbol;
      amountDecimals = _.find(tokens, { address: order.makerTokenAddress }).decimals;
      price = order.makerTokenAmount.div(order.takerTokenAmount);
      priceSymbol = _.find(tokens, { address: order.takerTokenAddress }).symbol;
      priceDecimals = _.find(tokens, { address: order.takerTokenAddress }).decimals;
      subtotal = order.takerTokenAmount;
      break;
    }

    let title = `${orderType === "ask" ? "Buy" : "Sell"} ${amount.toString()} ${amountSymbol}`;
    let styles = getStyles(5 * 45 + (isMine ? 25 : 0));

    return (
      <Card title={title} containerStyle={[ styles.container ]} wrapperStyle={[ styles.wrapper ]}>
        <View style={[ styles.row ]}>
          <Text>Price:</Text>
          <Text> </Text>
          <Text>{formatAmountWithDecimals(price, priceDecimals)} {priceSymbol}</Text>
        </View>
        <View style={[ styles.row ]}>
          <Text>Amount:</Text>
          <Text> </Text>
          <Text>{formatAmountWithDecimals(amount, amountDecimals)} {amountSymbol}</Text>
        </View>
        <View style={[ styles.row ]}>
          <Text>Subtotal:</Text>
          <Text> </Text>
          <Text>{formatAmount(subtotal)} {priceSymbol}</Text>
        </View>
        <View style={[ styles.row ]}>
          <Text>Fees:</Text>
          <Text> </Text>
          <Text>0 ZRX</Text>
        </View>
        <View style={[ styles.row ]}>
          <Text>Total:</Text>
          <Text> </Text>
          <Text>{formatAmount(subtotal)} {priceSymbol}</Text>
        </View>

        {!isMine ? (<Button
            large
            icon={<Icon name="send" size={20} color="white" />}
            onPress={this.fillOrder}
            text="Fill Order"
            style={[ styles.button ]} />) : null}
        {isMine ? (<Button
            large
            icon={<Icon name="cancel" size={20} color="white" />}
            onPress={this.cancelOrder}
            text="Cancel Order"
            style={[ styles.button ]} />) : null}
      </Card>
    );
  }
}

function getStyles(height) {
  return StyleSheet.create({
    row: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      height: 20
    },
    wrapper: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "stretch"
    },
    container: {
      height: height
    },
    button: {
      marginTop: 10
    }
  });
}

export default connect(state => ({ ...state.device, ...state.settings, ...state.wallet, ...state.relayer }), dispatch => ({ dispatch }))(OrderDetailsScreen);
