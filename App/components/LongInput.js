import React, { Component } from "react";
import { Input as RNEInput } from "react-native-elements";
import { colors } from "../../styles";

export default class LongInput extends Component {
  render() {
    let {
      containerStyle,
      inputStyle,
      ...rest
    } = this.props;
    return (
      <RNEInput {...rest}
          containerStyle={[{
            width: "100%"
          }, containerStyle]}
          inputStyle={[{
            marginLeft: 0,
            width: "100%"
          }, inputStyle]} />
    );
  }
}
