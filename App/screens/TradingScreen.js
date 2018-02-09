import React, { Component } from "react";
import { View, TouchableHighlight } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import { loadOrders } from "../../thunks";

class TradingScreen extends Component {
  render() {
    return (
      <List containerStyle={{
        marginBottom: 20,
        flex: 1,
        width: this.props.layout.width
      }}>
        {
          this.props.orders.map(({ orderHash }, index) => (
            <TouchableHighlight key={index} onPress={() => (this.props.navigator.push({
              passProps: { orderHash }
            }))}>
              <ListItem
                title={order.orderHash}
                leftIcon={{ name: "av-timer" }}
              />
            </TouchableHighlight>
          ))
        }
      </List>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    layout: state.device.layout,
    orders: state.orders
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TradingScreen);
