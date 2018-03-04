import React, { Component } from "react";
import { View } from "react-native";

export default class BigCenter extends Component {
  render() {
    let {
      style,
      ...rest
    } = this.props;
    return (
      <View {...rest} style={[{
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
      }, style]}>
        {this.props.children}
      </View>
    );
  }
}
