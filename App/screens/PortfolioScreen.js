import React, { Component } from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { Card, Header, Icon } from "react-native-elements";
import { connect } from "react-redux";
import NormalHeader from "../headers/Normal";
import AssetList from "../components/AssetList";

class PortfolioScreen extends Component {
  render() {
    return (
      <AssetList assets={this.props.assets} />
    );
  }
}

export default connect(state => ({ ...state.wallet }), dispatch => ({ dispatch }))(PortfolioScreen);
