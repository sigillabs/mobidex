import * as _ from "lodash";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import NormalHeader from "../headers/Normal";
import { fillOrder, cancelOrder } from "../../utils/orders";

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

  getOrder = () => {
    const { navigation: { state: { params: { orderHash } } }, orders } = this.props;
    return _.find(orders, { orderHash });
  };

  fillOrder = async () => {
    const { web3, address } = this.props;
    const order = this.getOrder();
    
    let receipt = await fillOrder(web3, order);
    console.warn(receipt);
  };

  render() {
    const { address } = this.props;
    const order = this.getOrder();
    const isMine = order.maker === address;
    const orderType = this.props.quoteToken.address === order.makerTokenAddress ? "bid" : "ask";
    let amount = null;
    let amountSymbol = null;
    let price = null;
    let priceSymbol = null;
    let subtotal = null;

    switch(orderType) {
      case "bid":
      amount = order.takerTokenAmount;
      amountSymbol = _.find(this.props.tokens, { address: order.takerTokenAddress }).symbol;
      price = order.takerTokenAmount.div(order.makerTokenAmount);
      priceSymbol = _.find(this.props.tokens, { address: order.makerTokenAddress }).symbol;
      subtotal = order.makerTokenAmount;
      break;

      case "ask":
      amount = order.makerTokenAmount;
      amountSymbol = _.find(this.props.tokens, { address: order.makerTokenAddress }).symbol;
      price = order.makerTokenAmount.div(order.takerTokenAmount);
      priceSymbol = _.find(this.props.tokens, { address: order.takerTokenAddress }).symbol;
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
          <Text>{price.toString(6)} {priceSymbol}</Text>
        </View>
        <View style={[ styles.row ]}>
          <Text>Amount:</Text>
          <Text> </Text>
          <Text>{amount.toString(6)} {amountSymbol}</Text>
        </View>
        <View style={[ styles.row ]}>
          <Text>Subtotal:</Text>
          <Text> </Text>
          <Text>{subtotal.toFixed(6)} {priceSymbol}</Text>
        </View>
        <View style={[ styles.row ]}>
          <Text>Fees:</Text>
          <Text> </Text>
          <Text>0 ZRX</Text>
        </View>
        <View style={[ styles.row ]}>
          <Text>Total:</Text>
          <Text> </Text>
          <Text>{subtotal.toFixed(6)} {priceSymbol}</Text>
        </View>

        {!isMine ? (<Button
                    large
                    icon={<Icon name="send" size={20} color="white" />}
                    onPress={this.fillOrder}
                    text="Fill Order" />) : null}
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
      height: 25
    },
    wrapper: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center"
    },
    container: {
      height: height
    }
  });
}

export default connect(state => ({ ...state.settings, ...state.wallet, ...state.device.layout, orders: state.relayer.orders }), dispatch => ({ dispatch }))(OrderDetailsScreen);
