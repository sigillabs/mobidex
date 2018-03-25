import * as _ from "lodash";
import React, { Component } from "react";
import { View, Text, ScrollView } from "react-native";
import { Card, Header, Icon } from "react-native-elements";
import { connect } from "react-redux";
import { lock } from "../../thunks";
import NormalHeader from "../headers/Normal";
import AssetList from "../views/AssetList";
import AssetDetails from "../views/AssetDetails";
import ReceiveTokens from "../views/ReceiveTokens";
import SendTokens from "../views/SendTokens";
import SendEther from "../views/SendEther";
import UnwrapEther from "../views/UnwrapEther";
import WrapEther from "../views/WrapEther";

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
        return (
          <ScrollView>
            <SendTokens token={this.state.token} close={() => {}} />
          </ScrollView>
        );
      } else {
        return (
          <ScrollView>
            <SendEther token={this.state.token} close={() => {}} />
          </ScrollView>
        );
      }
    }

    if (this.state.showReceive) {
      return (
        <ScrollView>
          <ReceiveTokens token={this.state.token} close={() => this.setState({ showReceive: false })} />
        </ScrollView>
      );
    }

    if (this.state.showWrap) {
      return (
        <ScrollView>
          <WrapEther close={() => this.setState({ showWrap: false })} />
        </ScrollView>
      );
    }

    if (this.state.showUnwrap) {
      return (
        <ScrollView>
          <UnwrapEther close={() => this.setState({ showUnwrap: false })} />
        </ScrollView>
      );
    }

    let ethAsset = _.find(this.props.assets, { symbol: "ETH" });
    let filteredAssets = _.without(this.props.assets, ethAsset);

    return (
      <ScrollView>
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-around", alignItems: "stretch" }}>
          <View style={{ height: 200 }}>
            <AssetDetails address={this.props.address} asset={this.state.token || ethAsset} onAction={async (action) => {
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
          </View>
          <View style={{ flex: 1 }}>
            <AssetList
                asset={this.state.token}
                assets={filteredAssets}
                onPress={(asset) => {
                  if (this.state.token && this.state.token.address === asset.address) {
                    this.setState({ token: null });
                  } else {
                    this.setState({ token: asset });
                  }
                }} />
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default connect(state => ({ ...state.wallet, ...state.device.layout }), dispatch => ({ dispatch }))(PortfolioScreen);
