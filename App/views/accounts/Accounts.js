import React, { Component } from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { Card, Header, Icon } from "react-native-elements";
import { Actions } from "react-native-router-flux";

export default class Accounts extends Component {
  render() {
    let address = this.props.ethereum.wallet.getAddress().toString("hex");
    return (
      <View>
        <Header>
          <TouchableHighlight onPress={() => (Actions.menu())}>
            <Icon name="menu" />
          </TouchableHighlight>
        </Header>
        <Card title={address}>
        </Card>
      </View>
    );
  }
}
