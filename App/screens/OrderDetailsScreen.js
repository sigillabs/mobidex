import * as _ from "lodash";
import React, { Component } from "react";
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
    return (
      <Card title={order.orderHash}>
        {!isMine ? (<Button
                    large
                    icon={<Icon name="send" size={20} color="white" />}
                    onPress={this.fillOrder}
                    text="Fill Order" />) : null}
      </Card>
    );
  }
}

export default connect(state => ({ ...state.wallet, orders: state.relayer.orders }), dispatch => ({ dispatch }))(OrderDetailsScreen);
