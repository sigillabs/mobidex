import React, { Component } from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";

export default class AssetItem extends Component {
  render() {
    let { token, balance } = this.props;

    return (
      <View style={[{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", }]}>
        <Text>{token.symbol.toString()}</Text>
        <Text>{balance}</Text>
      </View>
    );
  }
}
