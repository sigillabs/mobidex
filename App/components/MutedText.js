import React, { Component } from "react";
import { Text } from "react-native-elements";
import { colors } from "../../styles";

export default class MutedText extends Component {
  render() {
    let { style } = this.props;

    return (
      <Text style={[{ fontSize: 11, color: colors.grey1 }, style]}>{this.props.children}</Text>
    );
  }
}
