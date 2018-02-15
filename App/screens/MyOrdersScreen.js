import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import OrderList from "../components/OrderList";
import NormalHeader from "../headers/Normal";

class MyOrdersScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: <NormalHeader navigation={navigation} />
    };
  };

  render() {
    let orders = this.props.orders.filter((order) => (order.maker == this.props.address));
    return (
      <OrderList orders={orders} onPress={({ orderHash }) => (this.props.navigation.navigate("OrderDetails", { orderHash }))} />
    );
  }
}

export default connect((state) => ({ ...state.device, ...state.wallet, orders: state.relayer.orders }), (dispatch) => ({ dispatch }))(MyOrdersScreen);
