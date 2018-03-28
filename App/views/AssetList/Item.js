import React, { Component } from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";
import { formatAmount, formatAmountWithDecimals } from "../../../utils/display";
import { price } from "../../../fx";

export default class AssetItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forexPrice: null
    };
  }

  async componentDidMount() {
    let forexPrice = await price({ quoteCurrency: "USD", baseCurrency: this.props.asset.symbol });
    this.setState({ forexPrice });
  }

  render() {
    let { asset } = this.props;
    let { symbol, balance, decimals } = asset;

    let forexPrice = balance.mul(this.state.forexPrice || 0);

    return (
      <View style={[ styles.container]}>
        <Text>{symbol.toString()}</Text>
        <Text> </Text>
        <Text>{formatAmountWithDecimals(balance, decimals)}</Text>
        <Text> </Text>
        <Text>(${formatAmount(forexPrice)})</Text>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: 5
  }
};
