import React, { Component } from "react";
import { View } from "react-native";
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
    console.warn(message, stack);

    return (
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
            fontSize: 18,
            color: "white",
            paddingBottom: 10
          }}>{message}</Text>
        <Button
            large
            title="Get Out Of Here"
            icon={<Icon name="refresh" color="white" />}
            buttonStyle={{ borderRadius: 0 }}
            onPress={this.leave} />
      </View>
    );
  }
}

export default connect((state) => ({ }), dispatch => ({ dispatch }))(Err);
