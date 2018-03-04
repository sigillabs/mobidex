import React, { Component } from "react";
import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";

export default class extends Component {
  render() {
    return (
      <Header
        centerComponent={{ text: "Mobidex", style: { color: "white" } }}
      />
    );
  }
}
