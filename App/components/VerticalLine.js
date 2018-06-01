import React, { Component } from "react";
import { Animated } from "react-native";
import { colors } from "../../styles";

export default class VerticalLine extends Component {
  render() {
    return (
      <Animated.View style={[{ backgroundColor: colors.yellow0, height: 10, width: 1 }, this.props.style]} />
    );
  }
}
