import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card } from "react-native-elements";
import { connect } from "react-redux";
import { generateWallet } from "../thunks";

class Onboarding extends Component {
  submit = () => {
    this.props.dispatch(generateWallet());
  }

  render() {
    return (
      <View style={[{ marginTop: 10 }]}>
        <Card title="Create Your Wallet">
          <Button
            large
            text="Generate"
            onPress={this.submit} />
        </Card>
      </View>
    );
  }
}

export default connect(() => ({}), dispatch => ({ dispatch }))(Onboarding);
