import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Card, Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import BigNumber from "bignumber.js";
import { ZeroEx } from "0x.js";
import { sendEther } from "../../thunks";

class SendEther extends Component {
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
    let { address, amount } = this.state;
    let result = await this.props.dispatch(sendEther(address, amount));
    if (result) {
      this.props.close();
    }
  }

  render() {
    return (
      <Card title="Send Ether">
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
          text={`Send`}
          style={{ width: "100%" }} />
      </Card>
    );
  }
}

export default connect(state => ({ ...state.device.layout, ...state.wallet }), dispatch => ({ dispatch }))(SendEther);
