import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { generateWallet } from "../thunks";

export default class Onboarding extends Component {
  submit = () => {
    this.props.dispatch(generateWallet((dispatch) => {
      Actions.reset("accounts");
    }));
  }

  render() {
    let styles = getStyles(this.props.device.layout);
    return (
      <View style={[styles.container]}>
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

function getStyles (layout) {
  return StyleSheet.create({
    container: {
      marginTop: 10
    }
  })
}
