import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import { loadOrders } from "../../thunks";
import OrderList from "../components/OrderList";
import TradingInfo from "../components/TradingInfo";

class TradingScreen extends Component {
  componentDidMount() {
    this.props.dispatch(loadOrders());
  }

  render() {
    return (
      <View>
        <TradingInfo />
        <OrderList orders={this.props.orders} onPress={({ orderHash }) => (this.props.navigation.navigate("OrderDetails", { orderHash }))} />
      </View>
    );
  }
}

export default connect((state) => ({ ...state.device, orders: state.relayer.orders }), (dispatch) => ({ dispatch }))(TradingScreen);
