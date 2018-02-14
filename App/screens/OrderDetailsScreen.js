import * as _ from "lodash";
import React, { Component } from "react";
import { Button, Card, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import NormalHeader from "../headers/Normal";
import { fillOrder } from "../../utils/orders";

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
  }

  fillOrder = async () => {
    const { wallet: { web3 } } = this.props;
    const order = this.getOrder();
    
    let receipt = await fillOrder(web3, order);
    console.warn(receipt);
  };

  render() {
    const order = this.getOrder();
    return (
      <Card title={order.orderHash}>
        <Button
            large
            icon={<Icon name="send" size={20} color="white" />}
            onPress={this.fillOrder}
            text="Fill Order" />
      </Card>
    );
  }
}

export default connect(state => ({ wallet: state.wallet, orders: state.relayer.orders }), dispatch => ({ dispatch }))(OrderDetailsScreen);
