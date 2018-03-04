import React, { Component } from "react";
import { Input, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import { generateWallet, lock, unlock } from "../../thunks";
import Button from "./Button";
import BigCenter from "./BigCenter";

class Unlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      passwordError: false
    };
  }

  onSetPassword = (value) => {
    this.setState({ password: value, passwordError: false });
  };

  unlock = async () => {
    try {
      await this.props.dispatch(unlock(this.state.password));
    } catch(err) {
      this.setState({ passwordError: true });
      return;
    }

    if (this.props.onFinish) await this.props.onFinish();
  };

  render() {
    return (
      <BigCenter>
        <Input
          secureTextEntry={true}
          placeholder="Password"
          displayError={this.state.passwordError}
          onChangeText={this.onSetPassword}
          errorMessage={"Wrong or poorly formatted password. Passwords must be at least 6 characters long and must contain both numbers and letters."}
          errorStyle={{ color: "red" }}
          icon={<Icon name="person" size={24} color="black" />}
          containerStyle={{ width: "100%", marginBottom: 10 }} />
        <Button
            large
            text="Unlock"
            onPress={this.unlock} />
      </BigCenter>
    );
  }
}

export default connect((state) => ({ }), dispatch => ({ dispatch }))(Unlock);
