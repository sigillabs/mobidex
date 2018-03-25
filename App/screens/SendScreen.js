import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Card, Input } from "react-native-elements";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import BigNumber from "bignumber.js";
import { ZeroEx } from "0x.js";
import { sendEther, sendTokens } from "../../thunks";
import GlobalStyles from "../../styles";
import Button from "../components/Button";

class SendScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: new BigNumber(0),
      amountError: false,
      address: "",
      addressError: false
    };
  }

  onSetAmount = (value) => {
    try {
      let amount = new BigNumber(value);
      if (amount.gt(0)) {
        this.setState({ amount: amount, amountError: false });
      } else {
        this.setState({ amount: new BigNumber(0), amountError: true });
      }
    } catch(err) {
      this.setState({ amount: new BigNumber(0), amountError: true });
    }
  };

  onSetAddress = (value) => {
    this.setState({ address: value, addressError: false });
  };

  submit = async () => {
    let { navigation: { state: { params: { token }}} } = this.props;
    let { address, amount } = this.state;
    if (token.address === null) {
      await this.props.dispatch(sendEther(address, amount));
    } else {
      await this.props.dispatch(sendTokens(token, address, amount));
    }
    this.props.navigation.push("Portfolio");
  };

  render() {
    let { navigation: { state: { params: { token }}} } = this.props;
    return (
      <Card title={`Send ${token.name}`}>
        <View style={{ marginBottom: 10 }}>
          <Input
              placeholder="Amount"
              displayError={this.state.amountError}
              onChangeText={this.onSetAmount}
              keyboardType="numeric"
              errorMessage={"Amount should be numeric and greater than `0`."}
              errorStyle={{ color: "red" }}
              icon={<Icon name="money" size={24} color="black" />}
              containerStyle={{ width: "100%", marginBottom: 10 }} />
          <Input
              placeholder="Address"
              onChangeText={this.onSetAddress}
              keyboardType="ascii-capable"
              icon={<Icon name="user" size={24} color="black" />}
              containerStyle={{ width: "100%", marginBottom: 10 }} />
        </View>
        <Button
            large
            onPress={this.submit}
            icon={<Icon name="check" size={24} color="white" />}
            title={"Send"}
            style={{ width: "100%" }} />
      </Card>
    );
  }
}

export default connect(state => ({ ...state.device.layout, ...state.wallet }), dispatch => ({ dispatch }))(SendScreen);
