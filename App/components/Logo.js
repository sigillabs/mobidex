import React, { Component } from "react";
import { View } from "react-native";
import { Avatar, Text } from "react-native-elements";
import MutedText from "./MutedText";

export default class Logo extends Component {
  getImage() {
    switch(this.props.symbol) {
      default:
      return require("../../images/erc20-default.png");
    }
  }

  render() {
    let { subtitle } = this.props;
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Avatar
          xlarge
          rounded
          source={this.getImage()}
          activeOpacity={0.7}
        />
        {subtitle ? <MutedText style={{ marginTop: 5 }}>{subtitle}</MutedText> : null}
      </View>
    );
  }
}
