import React, { Component } from "react";
import { TouchableHighlight } from "react-native";
import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";

export default class extends Component {
  render() {
    return (
      <Header
        leftComponent={(
          <TouchableHighlight onPress={() => this.props.navigation.goBack(null)}>
            <Icon name="arrow-back" size={40} color="white" />
          </TouchableHighlight>
        )}
        centerComponent={{ text: "Mobidex", style: { color: "white" } }} />
    );
  }
}
