import React, { Component } from "react";
import { Button as RNEButton } from "react-native-elements";
import { colors } from "../../styles";

export default class Button extends Component {
  render() {
    let {
      textStyle,
      buttonStyle,
      ...rest
    } = this.props;
    return (
      <RNEButton
          {...rest}
          textStyle={[{
            backgroundColor: "transparent",
            color: colors.primary
          }, textStyle]}
          buttonStyle={[{
            backgroundColor: "white",
            borderColor: colors.primary,
            borderRadius: 0,
            borderWidth: 1,
            marginTop: 5,
            marginRight: 5,
            marginBottom: 5,
            marginLeft: 5
          }, buttonStyle]} />
    );
  }
}
