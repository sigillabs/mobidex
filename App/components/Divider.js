import React, { Component } from "react";
import { Divider as RNEDivider } from "react-native-elements";

export default class Divider extends Component {
  render() {
    return (
      <RNEDivider style={{ backgroundColor: 'blue', marginTop: 10, marginBottom: 10 }} />
    );
  }
}
