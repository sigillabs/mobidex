import React, { Component } from "react";
import { ButtonGroup as RNEButtonGroup } from "react-native-elements";
import { colors } from "../../styles";

export default class ButtonGroup extends Component {
  render() {
    let {
      containerStyle,
      buttonStyle,
      containerBorderRadius,
      textStyle,
      ...rest
    } = this.props;
    return (
      <RNEButtonGroup
          {...rest}
          containerBorderRadius={containerBorderRadius || 0}
          containerStyle={[{
            borderRadius: 0,
            borderWidth: 0,
            height: 40,
            padding: 0,
            marginTop: 0,
            marginRight: 0,
            marginBottom: 0,
            marginLeft: 0
          }, containerStyle]}
          buttonStyle={[{
            backgroundColor: colors.orange1,
            paddingLeft: 10,
            paddingRight: 10
          }, buttonStyle]}
          textStyle={[{
            color: "white"
          }]}/>
    );
  }
}
