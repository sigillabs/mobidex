import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Card, Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import BigNumber from "bignumber.js";
import { ZeroEx } from "0x.js";
import { sendTokens, sendEthereum } from "../../thunks";
import NormalHeader from "../headers/Normal";

class SendTokensScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: <NormalHeader navigation={navigation} />
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      amount: new BigNumber(0),
      amountError: false,
      address: ""
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
    let { price, amount } = this.state;
    let result = await this.props.dispatch(createSignSubmitOrder(price, amount));
    if (result) {
      this.props.navigation.navigate("Trading");
    }
  }

  render() {
    return (
      <Card title={`Send`} wrapperStyle={[styles.wrapper]}>
        <Input
            placeholder="Amount"
            displayError={this.state.amountError}
            onChangeText={this.onSetAmount}
            keyboardType="numeric"
            errorMessage={"Amount should be numeric and greater than `0`."}
            errorStyle={{ color: "red" }}
            icon={<Icon name="money" size={24} color="black" />} />
        <Input
            placeholder="Address"
            onChangeText={this.onSetAddress}
            keyboardType="ascii-capable"
            icon={<Icon name="user" size={24} color="black" />} />
        <Button
          large
          onPress={this.submit}
          icon={<Icon name="check" size={24} color="white" />}
          text={`Send`} />
      </Card>
    );
  }
}

styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    justifyContent: "flex-start"
  }
});

export default connect(state => ({ address: state.wallet.address }), dispatch => ({ dispatch }))(SendTokensScreen);
