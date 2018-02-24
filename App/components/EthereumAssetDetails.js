import React, { Component } from "react";
import { View } from "react-native";
import { Avatar, Button, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import { formatAmountWithDecimals, summarizeAddress } from "../../utils/display";
import { getBalance } from "../../utils/ethereum";

class EthereumAssetDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddress: false,
      balance: null,
      ready: false
    };
  }

  async componentDidMount() {
    let { web3, address } = this.props;
    let balance = await getBalance(web3, address);
    this.setState({ ready: true, balance: balance });
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
    if (!this.state.ready) return null;

    let { address } = this.props;

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
          <Text style={{ marginTop: 10, marginBottom: 10 }}>{formatAmountWithDecimals(this.state.balance, 18)}</Text>
          <Text onPress={this.toggleShowAddress}>{this.state.showAddress ? this.props.address : summarizeAddress(this.props.address)}</Text>
        </View>
        
        <View style={{ height: 50 }}>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Button
              large
              text="Receive"
              icon={<Icon name="home" color="white" />}
              buttonStyle={{ borderRadius: 0 }}
              onPress={this.receive} />
            <View style={{ width: 10 }} />
            <Button
              large
              text="Send"
              icon={<Icon name="send" color="white" />}
              buttonStyle={{ borderRadius: 0 }}
              onPress={this.send} />
          </View>
        </View>
      </View>
    );
  }
}

export default connect(state => ({ ...state.device.layout, ...state.wallet }), dispatch => ({ dispatch }))(EthereumAssetDetails);
