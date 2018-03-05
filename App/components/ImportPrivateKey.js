import React, { Component } from "react";
import { Input, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import { importPrivateKey } from "../../thunks";
import LongButton from "./LongButton";
import LongInput from "./LongInput";
import BigCenter from "./BigCenter";

class ImportPrivateKey extends Component {
  constructor(props) {
    super(props);

    this.state = {
      privateKey: "",
      privateKeyError: false,
      password: "",
      passwordError: false
    };
  }

  onSetPrivateKey = (value) => {
    this.setState({ privateKey: value, privateKeyError: false });
  };

  onSetPassword = (value) => {
    this.setState({ password: value, passwordError: false });
  };

  async importPrivateKey() {
    if (!this.state.privateKey) {
      this.setState({ privateKeyError: true });
      return;
    }

    if (!this.state.password) {
      this.setState({ passwordError: true });
      return;
    }

    try {
      await this.props.dispatch(importPrivateKey(this.state.privateKey, this.state.password));
    } catch(err) {
      this.setState({ passwordError: true });
      return;
    }

    if (this.props.onFinish) await this.props.onFinish();
  };

  render() {
    return (
      <BigCenter>
        <LongInput
          secureTextEntry={true}
          placeholder="Private Key"
          displayError={this.state.privateKeyError}
          onChangeText={this.onSetPrivateKey}
          errorMessage={"Private key isn't right for some reason. Make sure you've typed it in correctly."}
          errorStyle={{ color: "red" }}
          icon={<Icon name="vpn-key" size={24} color="black" />}
          containerStyle={{ width: "100%", marginBottom: 10 }} />
        <LongInput
          secureTextEntry={true}
          placeholder="Password"
          displayError={this.state.passwordError}
          onChangeText={this.onSetPassword}
          errorMessage={"Wrong or poorly formatted password. Passwords must be at least 6 characters long and must contain both numbers and letters."}
          errorStyle={{ color: "red" }}
          icon={<Icon name="person" size={24} color="black" />}
          containerStyle={{ width: "100%", marginBottom: 10 }} />
        <LongButton
            large
            text="Import Private Key"
            onPress={() => this.importPrivateKey()} />
      </BigCenter>
    );
  }
}

export default connect((state) => ({ }), dispatch => ({ dispatch }))(ImportPrivateKey);
