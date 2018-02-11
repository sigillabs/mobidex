import React, { Component } from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { Card, Header, Icon } from "react-native-elements";
import { connect } from "react-redux";

class SendTokensScreen extends Component {
  render() {
    return (
      <Card title={this.props.address} />
    );
  }
}

export default connect(state => ({ address: state.wallet.address }), dispatch => ({ dispatch }))(SendTokensScreen);
