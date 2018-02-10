import React, { Component } from "react";
import { View, TouchableHighlight } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import { loadOrders } from "../../thunks";

class TradingScreen extends Component {
  componentDidMount() {
    this.props.dispatch(loadOrders());
  }

  render() {
    return (
      <List containerStyle={{
        marginBottom: 20,
        flex: 1,
        width: this.props.layout.width
      }}>
        {
          this.props.orders.map(({ orderHash }, index) => (
            <TouchableHighlight key={index} onPress={() => (this.props.navigation.navigate("OrderDetails", { orderHash }))}>
              <ListItem
                title={orderHash}
                leftIcon={{ name: "av-timer" }}
              />
            </TouchableHighlight>
          ))
        }
      </List>
    );
  }
}

export default connect((state) => ({ ...state.device, orders: state.orders }), (dispatch) => ({ dispatch }))(TradingScreen);
