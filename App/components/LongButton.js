import React, { Component } from "react";
import Button from "./Button";
import { colors } from "../../styles";

export default class LongButton extends Component {
  render() {
    let {
      buttonStyle,
      textStyle,
      ...rest
    } = this.props;
    return (
      <Button 
          textStyle={[{ textAlign: "center", width: "100%" }, textStyle]}
          buttonStyle={[{ width: "100%" }, buttonStyle]} {...rest} />
    );
  }
}
