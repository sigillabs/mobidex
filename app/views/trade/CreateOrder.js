import React, { Component } from "react";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import { Button, FormLabel, FormInput } from "react-native-elements";
import { Link } from "react-router-native";
import { ZeroEx } from "0x.js";
import BN from "bn.js";
import HttpProvider from "ethjs-provider-http";
import Eth from "ethjs-query";
import { sign } from "ethjs-signer";
import Tx from "ethereumjs-tx";
import Web3 from "web3";

// Local account
// const address = "0x9bca8678b0239b604a26A57CBE76DC0D16d61e1F";
// const privateKey = "0x2e3a718ef4b1cc2ab905cec11430fa0f89acbfed6cd55639923adf2af17d3bc3";

// Kovan account
const address = "0x004a47EABdc8524Fe5A1cFB0e3D15C2c255479e3";
const privateKey = "0x63861eae41f4291336420cc3730abcb4633ae89c231ce989f90472a3231fbdca";

// const eth = new Eth(new HttpProvider("http://localhost:8545"));
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

export default class CreateOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nonce: null,
      tx: null,
      receipt: null
    };
  }

  // componentDidMount() {
  //   eth.getTransactionCount(address).then((nonce) => {
  //     let signature = sign({
  //       to: "0xce31a19193d4b23f4e9d6163d7247243bAF801c3",
  //       value: 300000,
  //       gas: new BN("43092000"),
  //       // when sending a raw transactions it"s necessary to set the gas price, currently 0.00000002 ETH
  //       gasPrice: new BN("20000000000"),
  //       nonce: nonce,
  //     }, privateKey);

  //     this.setState({ nonce, signature });
  //   }).catch((err) => {
  //     console.warn(err);
  //   });
  // }

  componentDidMount() {
    web3.eth.getTransactionCount(address, (err, nonce) => {
      if (err) {
        return;
      }

      let tx = new Tx({
        to: "0xce31a19193d4b23f4e9d6163d7247243bAF801c3",
        value: 300000,
        gas: new BN("2100000"),
        // when sending a raw transactions it's necessary to set the gas price, currently 0.00000002 ETH
        gasPrice: new BN("20000000000"),
        nonce: nonce,
      });
      tx.sign(new Buffer(privateKey.substring(2), "hex"));

      let serialized = tx.serialize();

      web3.eth.sendRawTransaction(`0x${serialized.toString("hex")}`, (err, receipt) => {
        if (err) {
          console.error(err);
          return;
        }
        this.setState({ nonce, receipt, tx: serialized });
      });

      
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
          <Text>{this.state.receipt}</Text>
        </View>
      </View>
    );
  }
}
