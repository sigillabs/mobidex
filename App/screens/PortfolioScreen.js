import * as _ from "lodash";
import React, { Component } from "react";
import { View, Text } from "react-native";
import { Card, Header, Icon } from "react-native-elements";
import { connect } from "react-redux";
import NormalHeader from "../headers/Normal";
import AssetList from "../components/AssetList";
import AssetDetails from "../components/AssetDetails";
import EthereumAssetDetails from "../components/EthereumAssetDetails";
import ReceiveTokens from "../components/ReceiveTokens";
import SendTokens from "../components/SendTokens";
import SendEther from "../components/SendEther";
import { lock } from "../../thunks";

class PortfolioScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null,
      showSend: false,
      showReceive: false
    };
  }

  close = () => {
    this.setState({ showSend: false, showReceive: false });
    this.props.navigation.setParams({ back: null });
  };

  renderAssetDetails() {
    if (!this.state.token) {
      return (
        <EthereumAssetDetails onAction={(action) => {
          switch(action) {
            case "send":
            this.props.navigation.setParams({ back: this.close });
            this.setState({ showSend: true, showReceive: false });
            break;

            case "receive":
            this.props.navigation.setParams({ back: this.close });
            this.setState({ showSend: false, showReceive: true });
            break;
          }
        }} />
      );
    }

    return (
      <AssetDetails address={this.props.address} asset={this.state.token} onAction={(action) => {
        switch(action) {
          case "send":
          this.props.navigation.setParams({ back: this.close });
          this.setState({ showSend: true, showReceive: false });
          break;

          case "receive":
          this.props.navigation.setParams({ back: this.close });
          this.setState({ showSend: false, showReceive: true });
          break;
        }
      }} />
    );
  }

  render() {
    if (this.state.showSend) {
      if (this.state.token) {
        return <SendTokens token={this.state.token} close={() => {}} />;
      } else {
        return <SendEther token={this.state.token} close={() => {}} />;
      }
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
