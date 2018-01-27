import React, { Component } from "react";
import { TouchableHighlight } from "react-native";
import { List, ListItem } from "react-native-elements";
import { Actions } from "react-native-router-flux";

export default class Menu extends Component {
  render() {
    return (
      <List containerStyle={{
        marginBottom: 20,
        flex: 1,
        width: this.props.device.layout.width
      }}>
        <TouchableHighlight onPress={() => (Actions.accounts())}>
          <ListItem
            title="Wallet"
            leftIcon={{ name: "av-timer" }}
          />
        </TouchableHighlight>
        <TouchableHighlight onPress={() => (Actions.orders())}>
          <ListItem
            title="Trade"
            leftIcon={{ name: "av-timer" }}
          />
        </TouchableHighlight>
        <TouchableHighlight onPress={() => (Actions.createOrder())}>
          <ListItem
            title="Create Order"
            leftIcon={{ name: "av-timer" }}
          />
        </TouchableHighlight>
      </List>
    );
  }
}
