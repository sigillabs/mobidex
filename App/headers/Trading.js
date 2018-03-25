import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";

class TradingHeader extends Component {
  render() {
    return (
      <Header
        backgroundColor= "#43484d"
        statusBarProps={{ barStyle: "light-content" }}
        centerComponent={{ text: "Mobidex", style: { color: "white", fontSize: 18 } }}
        rightComponent={(
          <TouchableOpacity style={{ padding: 10 }} onPress={() => this.props.navigation.navigate("CreateOrder")}>
            <Icon name="add" color="white" size={15}/>
          </TouchableOpacity>
        )}
      />
    );
  }
}

export default connect((state) => ({ }), dispatch => ({ dispatch }))(TradingHeader);
