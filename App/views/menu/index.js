import React, { Component } from "react";
import { View } from "react-native";
import Navigation from "./Navigation";
import CurrencySettings from "./CurrencySettings";

export default class Menu extends Component {
  render() {
    console.warn("re-render");
    return (
      <View style={{
        height: this.props.device.layout.height, 
        width: this.props.device.layout.width
      }}>
        <Navigation />
      </View>
    );
  }
}
