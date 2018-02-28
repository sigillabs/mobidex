import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import OrderItem from "./Item";

class OrderList extends Component {
  render() {
    return (
      <ScrollView>
        <List containerStyle={{
          flex: 1,
          width: this.props.width
        }}>
          {
            this.props.orders
            .filter(({ makerTokenAddress }) => makerTokenAddress === this.props.quoteToken.address)
            .filter(({ takerTokenAddress }) => takerTokenAddress === this.props.baseToken.address)
            .map((order, index) => (
              <TouchableOpacity key={`bid-${index}`} onPress={() => (this.props.onPress(order))}>
                <ListItem
                  title={<OrderItem order={order} />}
                  leftIcon={{ name: "add" }}
                />
              </TouchableOpacity>
            ))
          }
          {
            this.props.orders
            .filter(({ takerTokenAddress }) => takerTokenAddress === this.props.quoteToken.address)
            .filter(({ makerTokenAddress }) => makerTokenAddress === this.props.baseToken.address)
            .map((order, index) => (
              <TouchableOpacity key={`ask-${index}`} onPress={() => (this.props.onPress(order))}>
                <ListItem
                  title={<OrderItem order={order} />}
                  leftIcon={{ name: "remove" }}
                />
              </TouchableOpacity>
            ))
          }
        </List>
      </ScrollView>
    );
  }
}

export default connect((state) => ({ ...state.device.layout, ...state.settings }), (dispatch) => ({ dispatch }))(OrderList);
