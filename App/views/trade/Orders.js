import React, { Component } from "react";
import { TouchableHighlight } from "react-native";
import { List, ListItem } from "react-native-elements";
import { Actions } from "react-native-router-flux";

export default class Orders extends Component {
  render() {
    return (
      <List containerStyle={{
        marginBottom: 20,
        flex: 1,
        width: this.props.device.layout.width
      }}>
        {
          this.props.orders.map((order, index) => (
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
