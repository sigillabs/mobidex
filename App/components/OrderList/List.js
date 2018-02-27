import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import Ask from "./Ask";
import Bid from "./Bid";

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
      </ScrollView>
    );
  }
}

export default connect((state) => ({ ...state.device.layout }), (dispatch) => ({ dispatch }))(OrderList);
