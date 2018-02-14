import React, { Component } from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { Card, Header, Icon } from "react-native-elements";
import { connect } from "react-redux";
import NormalHeader from "../headers/Normal";

class SendTokensScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: <NormalHeader navigation={navigation} />
    };
  };

  render() {
    return (
      <Card title={this.props.address} />
    );
  }
}

export default connect(state => ({ address: state.wallet.address }), dispatch => ({ dispatch }))(SendTokensScreen);
