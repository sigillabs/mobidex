import React, { Component } from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { Button, Card } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { generateWallet } from "../thunks";

export default class Onboarding extends Component {
  render() {
    return (
      <Card title="Create Your Wallet">
        <Button
          large
          icon={{ name: "cached" }}
          title="Generate"
          onPress={() => (this.props.dispatch(generateWallet()))} />
      </Card>
    );
  }
}
