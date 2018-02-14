import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import BigNumber from "bignumber.js";
import { ZeroEx } from "0x.js";
import NormalHeader from "../headers/Normal";
import { createSignSubmitOrder, gotoOrders } from "../../thunks";

class CreateOrderScreen extends Component {
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
    let result = await this.props.dispatch(createSignSubmitOrder(price, amount));
    if (result) {
      this.props.navigation.navigate("Trading");
    }
  }

  render() {
    const styles = getStyles(this.props.layout);

    return (
      <View style={[styles.form]}>
        <View>
          <Input
            placeholder="Price"
            displayError={this.state.priceError}
            onChangeText={this.onSetPrice}
            keyboardType="numeric"
            errorMessage={"Price should be numeric and greater than `0`."}
            errorStyle={{ color: "red" }}
            icon={<Icon name="money" size={24} color="black" />}
          />
        </View>
        <View>
          <Input
            placeholder="Amount"
            displayError={this.state.priceError}
            onChangeText={this.onSetAmount}
            keyboardType="numeric"
            errorMessage={"Amounts should be numeric and greater than `0`."}
            errorStyle={{ color: "red" }}
            icon={<Icon name="money" size={24} color="black" />}
          />
        </View>
        <View style={[styles.subtotal]}>
          <Text>Sub Total</Text>
          <Text style={[styles.subtotalText]}>{this.state.price.mul(this.state.amount).toFixed(6, 1)}</Text>
        </View>
        <Button
          large
          onPress={this.submit}
          icon={<Icon name="check" size={24} color="white" />}
          text="Submit Order" />
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

export default connect((state, ownProps) => ({ ...state.device, ...ownProps, ...state.wallet }), (dispatch) => ({ dispatch }))(CreateOrderScreen);
