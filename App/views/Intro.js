import React, { Component } from "react";
import { View, Text } from "react-native";
import { Avatar } from "react-native-elements";
import { colors } from "../../styles";


export default class Intro extends Component {
  render(){
    return(
      <View
        backgroundColor = "#43484d"
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 10,
          paddingRight: 10,
          paddingBottom: 10,
          paddingLeft: 10
        }}>
        <Text
          style={{
            fontSize: 35,
            color: "white",
            fontWeight: "bold",
            paddingBottom: 10
          }}>Mobidex</Text>
        <Avatar
          large
        />
        <Text
          style={{
            fontSize: 20,
            color: colors.orange1,
            fontWeight: "bold",
            paddingTop: 10,
            paddingBottom: 5,
          }}>Welcome to Mobidex, a mobile-first decentralized trading platform.</Text>
          <Text
            style={{
              fontSize: 15,
              color: "white",
            }}>To unlock your wallet, click Unlock.  To import a wallet, press Import.  To generate a new Wallet, please click New.</Text>
        </View>
    );
  }
}
