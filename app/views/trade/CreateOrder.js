import moment from "moment";
import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button, FormLabel, FormInput, FormValidationMessage } from "react-native-elements";
import BigNumber from "bignumber.js";
import { ZeroEx } from "0x.js";
import { createSignSubmitOrder, gotoOrders } from "../../thunks";

export default class CreateOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: new BigNumber(0),
      amountError: false,
      price: new BigNumber(0),
      priceError: false
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

  onSetPrice = (value) => {
    try {
      let price = new BigNumber(value);
      if (price.gt(0)) {
        this.setState({ price: price, priceError: false });
      } else {
        this.setState({ price: new BigNumber(0), priceError: true });
      }
    } catch(err) {
      this.setState({ price: new BigNumber(0), priceError: true });
    }
  };

  submit = async () => {
    let { price, amount } = this.state;
    
    if (await this.props.dispatch(createSignSubmitOrder(price, amount))) {
      this.props.dispatch(gotoOrders());
    } else {
      Actions.refresh(this.props);
    }
  }

  render() {
    const styles = getStyles(this.props.device.layout);

    return (
      <View style={[styles.form]}>
        <View>
          <FormLabel>Price</FormLabel>
          <FormInput onChangeText={this.onSetPrice} keyboardType="numeric" />
          {this.state.priceError ? (<FormValidationMessage>Price should be numeric and greater than `0`.</FormValidationMessage>) : null}
        </View>
        <View>
          <FormLabel>Amount</FormLabel>
          <FormInput onChangeText={this.onSetAmount} keyboardType="numeric" />
          {this.state.amountError ? (<FormValidationMessage>Amounts should be numeric and greater than `0`.</FormValidationMessage>) : null}
        </View>
        <View style={[styles.subtotal]}>
          <FormLabel>Sub Total</FormLabel>
          <Text style={[styles.subtotalText]}>{this.state.price.mul(this.state.amount).toFixed(6, 1)}</Text>
        </View>
        <Button
          large
          onPress={this.submit}
          icon={{name: 'cached'}}
          title='Submit Order' />
      </View>
    );
  }
}

function getStyles (layout) {
  return StyleSheet.create({
    form: {
      width: layout.width,
      flexDirection: "column",
      justifyContent: "center",
      paddingRight: 5,
      paddingLeft: 5
    },
    subtotal: {
      flexDirection: "column",
      justifyContent: "center",
      marginTop: 10,
      marginBottom: 20
    },
    subtotalText: {
      flexDirection: "column",
      justifyContent: "center",
      marginRight: 5,
      marginLeft: 20
    }
  })
}
