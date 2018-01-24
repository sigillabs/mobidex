import React, { Component } from "react";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import { Button, FormLabel, FormInput } from "react-native-elements";
import { Link } from "react-router-native";

export default class Accounts extends Component {
  render() {
    return (
      <View>
        <Text>Accounts</Text>
        <View>
          <Text>Address</Text>
          <Text>{this.props.account}</Text>
        </View>
      </View>
    );
  }
}
