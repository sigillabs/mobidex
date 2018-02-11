import React, { Component } from "react";
import { TouchableHighlight } from "react-native";
import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";

export default class extends Component {
  render() {
    return (
      <Header
        centerComponent={{ text: "Mobidex", style: { color: "white" } }}
        rightComponent={(
          <TouchableHighlight onPress={() => this.props.navigation.navigate("SendTokens")}>
            <Icon name="send" color="white" />
          </TouchableHighlight>
        )}
      />
    );
  }
}
