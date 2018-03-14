import React, { Component } from "react";
import { Card, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import { setError } from "../../actions";
import Button from "../components/Button.js";

class Err extends Component {
  leave = () => {
    this.props.dispatch(setError(null));
  };

  render() {
    let { message, stack } = this.props.error;

    return (
      <Card title={message}>
        <Button
            large
            text="Get Out Of Here"
            icon={<Icon name="refresh" color="white" />}
            buttonStyle={{ borderRadius: 0 }}
            onPress={this.leave} />
      </Card>
    );
  }
}

export default connect((state) => ({ }), dispatch => ({ dispatch }))(Err);
