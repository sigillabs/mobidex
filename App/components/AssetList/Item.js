import React, { Component } from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";

export default class AssetItem extends Component {
  render() {
    let { asset } = this.props;
    let { symbol, balance } = asset;

    return (
      <View style={[ styles.container]}>
        <Text>{symbol.toString()}</Text>
        <Text> </Text>
        <Text>{balance.toFixed(6)}</Text>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  }
};
