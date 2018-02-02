import React, { Component } from "react";
import { View, TouchableHighlight } from "react-native";
import { List, ListItem } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { loadOrders } from "../../thunks";

export default class Orders extends Component {
  render() {
    return (
      <List containerStyle={{
        marginBottom: 20,
        flex: 1,
        width: this.props.device.layout.width
      }}>
        {
          this.props.trade.orders.map((order, index) => (
            <TouchableHighlight key={index} onPress={() => (Actions.orderDetails({ orderHash: order.orderHash }))}>
              <ListItem
                title={order.orderHash}
                leftIcon={{ name: "av-timer" }}
              />
            </TouchableHighlight>
          ))
        }
      </List>
    ); 
  }
}
