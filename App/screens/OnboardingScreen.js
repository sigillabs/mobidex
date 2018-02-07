import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card } from "react-native-elements";
import { generateWallet } from "../../thunks";

export default class OnboardingScreen extends Component {
  submit = () => {
    this.props.dispatch(generateWallet((dispatch) => {
      this.props.navigator.push({
        screen: "mobidex.WalletScreen"
      });
    }));
  }

  render() {
    return (
      <View style={[{ marginTop: 10 }]}>
        <Card title="Create Your Wallet">
          <Button
            large
            icon={{ name: "cached" }}
            title="Generate"
            onPress={this.submit} />
        </Card>
      </View>
    );
  }
}
