import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import Row from "../components/Row";
import { loadOrders } from "../../thunks";

class TradingHeader extends Component {
  render() {
    let { quoteToken, baseToken } = this.props;

    return (
      <Header
        backgroundColor= "#43484d"
        statusBarProps={{ barStyle: 'light-content' }}
        leftComponent={(
          <TouchableOpacity onPress={() => this.props.navigation.navigate("MyOrders")}>
            <Icon name="person" color="white" />
          </TouchableOpacity>
        )}
        centerComponent={{ text: "Mobidex", style: { color: "white", fontSize:15 } }}
        rightComponent={(
          <Row>
            <TouchableOpacity onPress={() => this.props.dispatch(loadOrders())}>
              <Icon name="refresh" color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("CreateOrder")}>
              <Icon name="add" color="white" />
            </TouchableOpacity>
          </Row>
        )}
      />
    );
  }
}

export default connect((state) => ({ }), dispatch => ({ dispatch }))(TradingHeader);
