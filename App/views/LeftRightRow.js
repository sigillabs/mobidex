import React, { Component } from "react";
import { Text } from "react-native-elements";
import Row from "../components/Row";

export default class LeftRightRow extends Component {
  render() {
    let {
      leftStyle,
      rightStyle,
      rowStyle,
      left,
      right,
      ...rest
    } = this.props;
    return (
      <Row style={[rowStyle, { width: "100%" }]} {...rest}>
        <Text style={[{textAlign:"left",width:"50%"}, leftStyle]}>{left}</Text>
        <Text style={[{textAlign:"right",width:"50%"},rightStyle]}>{right}</Text>
      </Row>
    );
  }
}
