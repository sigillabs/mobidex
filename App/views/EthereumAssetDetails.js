import React, { Component } from "react";
import reactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { View } from "react-native";
import { Avatar, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import { formatAmountWithDecimals, summarizeAddress } from "../../utils/display";
import { getBalance } from "../../utils/ethereum";
import Button from "../components/Button";

@reactMixin.decorate(TimerMixin)
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
    this.requestAnimationFrame(() => {
      if (this.props.onAction) {
        this.props.onAction("receive");
      }
    });
  };

  send = () => {
    this.requestAnimationFrame(() => {
      if (this.props.onAction) {
        this.props.onAction("send");
      }
    });
  };

  wrap = () => {
    this.requestAnimationFrame(() => {
      if (this.props.onAction) {
        this.props.onAction("wrap");
      }
    });
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

        <View style={{ height: 50, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <Button
            large
            title="Receive"
            icon={<Icon name="move-to-inbox" color="white" size={18} />}
            buttonStyle={{ borderRadius: 0 }}
            onPress={this.receive} />
          <View style={{ width: 10 }} />
          <Button
            large
            title="Send"
            icon={<Icon name="send" color="white" size={18} />}
            buttonStyle={{ borderRadius: 0 }}
            onPress={this.send} />
          <View style={{ width: 10 }} />
          <Button
            large
            title="Wrap"
            icon={<Icon name="move-to-inbox" color="white" size={18} />}
            buttonStyle={{ borderRadius: 0 }}
            onPress={this.wrap} />
        </View>
      </View>
    );
  }
}

export default connect(state => ({ ...state.device.layout, ...state.wallet }), dispatch => ({ dispatch }))(EthereumAssetDetails);
