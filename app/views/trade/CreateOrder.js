import React, { Component } from "react";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import { Button, FormLabel, FormInput } from "react-native-elements";
import { Link } from "react-router-native";
import { ZeroEx } from "0x.js";
import BN from "bn.js";
import HttpProvider from "ethjs-provider-http";
import Eth from "ethjs-query";
import { sign } from "ethjs-signer";
import * as Web3 from "web3";

const address = "0x9bca8678b0239b604a26A57CBE76DC0D16d61e1F";
const privateKey = "0x2e3a718ef4b1cc2ab905cec11430fa0f89acbfed6cd55639923adf2af17d3bc3";
const eth = new Eth(new HttpProvider("http://localhost:8545"));

export default class CreateOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nonce: null,
      signature: null
    };
  }

  componentDidMount() {
    eth.getTransactionCount(address).then((nonce) => {
      let signature = sign({
        to: "0xce31a19193d4b23f4e9d6163d7247243bAF801c3",
        value: 300000,
        gas: new BN("43092000"),
        // when sending a raw transactions it"s necessary to set the gas price, currently 0.00000002 ETH
        gasPrice: new BN("20000000000"),
        nonce: nonce,
      }, privateKey);

      this.setState({ nonce, signature });
    }).catch((err) => {
      console.warn(err);
    });
  }

  render() {
    return (
      <View>
        <Text>Create Order</Text>
        <View>
          <Link to="/accounts">
            <Text>Accounts</Text>
          </Link>
        </View>
        <View>
          <Link to="/orders">
            <Text>Trade</Text>
          </Link>
        </View>
        <View>
          <Link to="/orders/1/details">
            <Text>Order Details</Text>
          </Link>
        </View>
        <View>
          <Link to="/orders/create">
            <Text>Create Order</Text>
          </Link>
        </View>
        <View>
          <Text>{this.state.signature}</Text>
        </View>
      </View>
    );
  }
}
