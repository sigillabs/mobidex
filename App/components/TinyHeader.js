import React, { Component } from "react";
import { Text } from "react-native-elements";
import { colors } from "../../styles";

export default class TinyHeader extends Component {
  render() {
    return (
      <Text style={{
        textAlign: "center",
        color: colors.grey0,
        flex: 0,
        fontSize: 10,
        height: 10
      }}>{this.props.children}</Text>
    );
  }
}
