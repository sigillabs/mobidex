import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import { loadOrders } from "../../thunks";
import OrderList from "../components/OrderList";

class TradingScreen extends Component {
  componentDidMount() {
    this.props.dispatch(loadOrders());
  }

  render() {
    return (
      <OrderList orders={this.props.orders} onPress={({ orderHash }) => (this.props.navigation.navigate("OrderDetails", { orderHash }))} />
    );
  }
}

export default connect((state) => ({ ...state.device, orders: state.relayer.orders }), (dispatch) => ({ dispatch }))(TradingScreen);
