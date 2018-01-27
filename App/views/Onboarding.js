import React, { Component } from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { Actions } from "react-native-router-flux";

export default class Onboarding extends Component {
  render() {
    return (
      <View>
        <Text>Onboarding</Text>
        <View>
          <TouchableHighlight onPress={() => (Actions.accounts())}>
            <Text>Accounts</Text>
          </TouchableHighlight>
        </View>
        <View>
          <TouchableHighlight onPress={() => (Actions.orders())}>
            <Text>Trade</Text>
          </TouchableHighlight>
        </View>
        <View>
          <TouchableHighlight onPress={() => (Actions.orderDetails({ orderHash: 1 }))}>
            <Text>Order Details</Text>
          </TouchableHighlight>
        </View>
        <View>
          <TouchableHighlight onPress={() => (Actions.createOrder())}>
            <Text>Create Order</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}
