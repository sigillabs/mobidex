import React, { Component } from "react";
import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";

export default class extends Component {
  render() {
    return (
      <Header
        backgroundColor= "#43484d"
        statusBarProps={{ barStyle: 'light-content' }}
        centerComponent={{ text: "Mobidex", style: { color: "white", fontSize:18 } }}
      />
    );
  }
}
