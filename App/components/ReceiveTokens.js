import React, { Component } from "react";
import { View, TouchableHighlight } from "react-native";
import { Card, Header, Icon, Text } from "react-native-elements";
import { connect } from "react-redux";
import ethUtil from "ethereumjs-util";

class ReceiveTokens extends Component {
  render() {
    let { address } = this.props;
    let uri = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${ethUtil.stripHexPrefix(this.props.address)}`;

    return (
      <Card
          image={{ uri }}
          imageWrapperStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
          imageStyle={{
            height: 250,
            width: 250
          }}
      >
        <View style={[{ justifyContent: "center", alignItems: "center" }]}>
          <Text h4>Address</Text>
          <Text>{this.props.address}</Text>
        </View>
      </Card>
    );
  }
}

export default connect(state => ({ ...state.device.layout, ...state.wallet }), dispatch => ({ dispatch }))(ReceiveTokens);
