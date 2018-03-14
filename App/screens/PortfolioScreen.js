import * as _ from "lodash";
import React, { Component } from "react";
import { View, Text } from "react-native";
import { Card, Header, Icon } from "react-native-elements";
import { connect } from "react-redux";
import NormalHeader from "../headers/Normal";
import AssetList from "../views/AssetList";
import AssetDetails from "../views/AssetDetails";
import EthereumAssetDetails from "../views/EthereumAssetDetails";
import ReceiveTokens from "../views/ReceiveTokens";
import SendTokens from "../views/SendTokens";
import SendEther from "../views/SendEther";
import UnwrapEther from "../views/UnwrapEther";
import WrapEther from "../views/WrapEther";
import { lock } from "../../thunks";

class PortfolioScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null,
      showSend: false,
      showReceive: false,
      showWrap: false,
      showUnwrap: false
    };
  }

  close = () => {
    this.setState({ showSend: false, showReceive: false, showWrap: false, showUnwrap: false });
    this.props.navigation.setParams({ back: null });
  };

  renderAssetDetails() {
    if (!this.state.token) {
      return (
        <EthereumAssetDetails onAction={async (action) => {
          switch(action) {
            case "send":
            this.setState({ showSend: true, showReceive: false, showWrap: false, showUnwrap: false });
            break;

            case "receive":
            this.setState({ showSend: false, showReceive: true, showWrap: false, showUnwrap: false });
            break;

            case "wrap":
            this.setState({ showSend: false, showReceive: false, showWrap: true, showUnwrap: false });
            break;

            default:
            return;
          }

          this.props.navigation.setParams({ back: this.close });
        }} />
      );
    }

    return (
      <AssetDetails address={this.props.address} asset={this.state.token} onAction={async (action) => {
        switch(action) {
          case "send":
          this.setState({ showSend: true, showReceive: false, showWrap: false, showUnwrap: false });
          break;

          case "receive":
          this.setState({ showSend: false, showReceive: true, showWrap: false, showUnwrap: false });
          break;

          case "unwrap":
          this.setState({ showSend: false, showReceive: false, showWrap: false, showUnwrap: true });
          break;

          default:
          return;
        }

        this.props.navigation.setParams({ back: this.close });
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
      return <ReceiveTokens token={this.state.token} close={() => this.setState({ showReceive: false })} />
    }

    if (this.state.showWrap) {
      return <WrapEther close={() => this.setState({ showWrap: false })} />
    }

    if (this.state.showUnwrap) {
      return <UnwrapEther close={() => this.setState({ showUnwrap: false })} />
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
