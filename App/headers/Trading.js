import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";

export default class extends Component {
  render() {
    let { quoteToken, baseToken } = this.props;

    return (
      <Header
        leftComponent={(
          <TouchableOpacity onPress={() => this.props.navigation.navigate("MyOrders")}>
            <Icon name="person" color="white" />
          </TouchableOpacity>
        )}
        centerComponent={{ text: "Mobidex", style: { color: "white" } }}
        rightComponent={(
          <TouchableOpacity onPress={() => this.props.navigation.navigate("CreateOrder")}>
            <Icon name="add" color="white" />
          </TouchableOpacity>
        )}
      />
    );
  }
}
