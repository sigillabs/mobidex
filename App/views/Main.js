import React, { Component } from "react";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import { Button, FormLabel, FormInput } from "react-native-elements";
import { Link } from "react-router-native";

export default class Main extends Component {
  render() {
    return (
      <View>
        <Text>Main</Text>
        <View>
          <Link to="/accounts">
            <Text>Accounts</Text>
          </Link>
        </View>
        <View>
          <Link to="/orders">
            <Text>Trade</Text>
          </Link>
        </View>
        <View>
          <Link to="/orders/1/details">
            <Text>Order Details</Text>
          </Link>
        </View>
        <View>
          <Link to="/orders/create">
            <Text>Create Order</Text>
          </Link>
        </View>
      </View>
    );
  }
}
