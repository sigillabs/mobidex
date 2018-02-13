import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import Ask from "./Ask";
import Bid from "./Bid";

class OrderList extends Component {
  render() {
    return (
      <List containerStyle={{
        marginBottom: 20,
        flex: 1,
        width: this.props.width
      }}>
        {
          this.props.orders
          .filter(({ makerTokenAddress }) => makerTokenAddress === this.props.quoteToken.address)
          .map((order, index) => (
            <TouchableOpacity key={`bid-${index}`} onPress={() => (this.props.onPress(order))}>
              <ListItem
                title={<Bid order={order} />}
                leftIcon={{ name: "add" }}
              />
            </TouchableOpacity>
          ))
        }
        {
          this.props.orders
          .filter(({ makerTokenAddress }) => makerTokenAddress !== this.props.quoteToken.address)
          .map((order, index) => (
            <TouchableOpacity key={`ask-${index}`} onPress={() => (this.props.onPress(order))}>
              <ListItem
                title={<Ask order={order} />}
                leftIcon={{ name: "remove" }}
              />
            </TouchableOpacity>
          ))
        }
      </List>
    );
  }
}

export default connect((state) => ({ ...state.device.layout, ...state.settings }), (dispatch) => ({ dispatch }))(OrderList);
