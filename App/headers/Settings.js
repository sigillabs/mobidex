import React, { Component } from "react";
import { Header } from "react-native-elements";

export default class extends Component {
  render() {
    return (
      <Header
        backgroundColor= "#43484d"
        statusBarProps={{ barStyle: "light-content" }}
        centerComponent={{ text: "Mobidex", style: { color: "white", fontSize: 18 } }}
      />
    );
  }
}
