import React, { Component } from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { Card, Header, Icon } from "react-native-elements";
import { connect } from "react-redux";

class WalletScreen extends Component {
  render() {
    return (
      <Card title={this.props.address} />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    address: state.wallet.address
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletScreen);
