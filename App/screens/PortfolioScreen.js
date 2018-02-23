import React, { Component } from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { Card, Header, Icon } from "react-native-elements";
import { connect } from "react-redux";
import NormalHeader from "../headers/Normal";
import AssetList from "../components/AssetList";
import AssetDetails from "../components/AssetDetails";
import EmptyAssetDetails from "../components/EmptyAssetDetails";
import ReceiveTokens from "../components/ReceiveTokens";
import SendTokens from "../components/SendTokens";

class PortfolioScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null,
      showSend: false,
      showReceive: false
    };
  }

  renderAssetDetails() {
    if (!this.state.token) {
      return (
        <EmptyAssetDetails />
      );
    }

    // if (this.state.token === "ETH") {
    //   return (

    //   );
    // }

    return (
      <AssetDetails address={this.props.address} asset={this.state.token} onAction={(action) => {
        switch(action) {
          case "send":
          this.setState({ showSend: true, showReceive: false });
          break;

          case "receive":
          this.setState({ showSend: false, showReceive: true });
          break;
        }
      }} />
    );
  }

  render() {
    if (this.state.showSend) {
      return <SendTokens token={this.state.token} close={() => (this.setState({ showSend: false }))} />;
    }

    if (this.state.showReceive) {
      return <ReceiveTokens token={this.state.token} close={() => (this.setState({ showReceive: false }))} />
    }

    return (
      <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-around", alignItems: "stretch" }}>
        <View style={{ height: 200 }}>
          {this.renderAssetDetails()}
        </View>
        <View style={{ flex: 1 }}>
          <AssetList
              asset={this.state.token}
              assets={this.props.assets}
              onPress={(asset) => {
                if (this.state.token && this.state.token.address === asset.address) {
                  this.setState({ token: null });
                } else {
                  this.setState({ token: asset });
                }
              }} />
        </View>
      </View>
    );
  }
}

export default connect(state => ({ ...state.wallet, ...state.device.layout }), dispatch => ({ dispatch }))(PortfolioScreen);
