import React, { Component } from "react";
import { View } from "react-native";
import { Avatar, Button, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { summarizeAddress } from "../../utils/display";

export default class EmptyAssetDetails extends Component {
  render() {
    return (
      <Text h1>Choose A Token</Text>
    );
  }
}
