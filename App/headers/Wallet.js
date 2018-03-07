import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";

export default class extends Component {
  render() {
    let back = null;
    if (this.props.navigation.state.params) {
      back = this.props.navigation.state.params.back;
    }

    let leftComponent = null;
    if (back) {
      leftComponent = (
        <TouchableOpacity onPress={back}>
          <Icon name="arrow-back" color="white" />
        </TouchableOpacity>
      );
    }
    return (
      <Header
        backgroundColor= "#43484d"
        statusBarProps={{ barStyle: 'light-content' }}
        leftComponent={leftComponent}
        centerComponent={{ text: "Mobidex", style: { color: "white", fontSize:15 } }}
      />
    );
  }
}
