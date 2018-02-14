import React, { Component } from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { Card, Header, Icon } from "react-native-elements";
import { connect } from "react-redux";
import NormalHeader from "../headers/Normal";

class PortfolioScreen extends Component {
  render() {
    return (
      <AssetList tokens={this.props.tokens} />
    );
  }
}

export default connect(state => ({ address: state.wallet.address, tokens: state.settings.tokens }), dispatch => ({ dispatch }))(PortfolioScreen);
