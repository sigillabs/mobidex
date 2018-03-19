import React, { Component } from "react";
import { View } from "react-native";
import { Avatar, Text } from "react-native-elements";
import { getImage } from "../../utils/display";
import MutedText from "./MutedText";

export default class Logo extends Component {
  render() {
    let { subtitle } = this.props;
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Avatar
          xlarge
          rounded
          source={getImage(this.props.symbol)}
          activeOpacity={0.7}
          overlayContainerStyle={{ backgroundColor: "transparent" }}
        />
        {subtitle ? <MutedText style={{ marginTop: 5 }}>{subtitle}</MutedText> : null}
      </View>
    );
  }
}
