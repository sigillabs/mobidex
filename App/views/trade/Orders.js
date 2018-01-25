import React, { Component } from "react";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import { List, ListItem } from "react-native-elements";
import { Link } from "react-router-native";

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
            <Link key={index} to={`/orders/${order.orderHash}/details`}>
              <ListItem
                title={order.orderHash}
                leftIcon={{ name: "av-timer" }}
              />
            </Link>
          ))
        }
      </List>
    );
  }
}
