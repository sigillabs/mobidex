import React, { Component } from "react";
import { View } from "react-native";
import { Avatar, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import Button from "./Button";
import { formatAmountWithDecimals, summarizeAddress } from "../../utils/display";

export default class AssetDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddress: false
    };
  }

  receive = () => {
    if (this.props.onAction) {
      this.props.onAction("receive");
    }
  };

  send = () => {
    if (this.props.onAction) {
      this.props.onAction("send");
    }
  };

  toggleShowAddress = () => {
    this.setState({ showAddress: !this.state.showAddress });
  };

  render() {
    let { asset, address } = this.props;
    let { balance, decimals } = asset;

    return (
      <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-around", alignItems: "stretch" }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Avatar
            large
            rounded
            // source={{uri: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"}}
            activeOpacity={0.7}
            onPress={this.toggleShowAddress}
          />
          <Text style={{ marginTop: 10, marginBottom: 10 }}>{formatAmountWithDecimals(balance, decimals)}</Text>
          <Text onPress={this.toggleShowAddress}>{this.state.showAddress ? address : summarizeAddress(address)}</Text>
        </View>

        <View style={{ height: 50 }}>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Button
              large
              text="Receive"
              icon={<Icon name="move-to-inbox" color="white" size={18} />}
              buttonStyle={{ borderRadius: 0 }}
              onPress={this.receive} />
            <View style={{ width: 10 }} />
            <Button
              large
              text="Send"
              icon={<Icon name="send" color="white" size={18} />}
              buttonStyle={{ borderRadius: 0 }}
              onPress={this.send} />
          </View>
        </View>
      </View>
    );
  }
}
