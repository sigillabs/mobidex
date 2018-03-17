import React, { Component } from "react";
import Button from "./Button";
import { colors } from "../../styles";

export default class LongButton extends Component {
  render() {
    let {
      buttonStyle,
      titleStyle,
      ...rest
    } = this.props;
    return (
      <Button 
          titleStyle={[{ width: "100%" }, titleStyle]}
          buttonStyle={[{ width: "100%" }, buttonStyle]} {...rest} />
    );
  }
}
