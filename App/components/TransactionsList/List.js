import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import Finished from "./Finished";
import Pending from "./Pending";

class TransactionsList extends Component {
  render() {
    return (
      <List containerStyle={{
        marginBottom: 20,
        flex: 1,
        width: this.props.width
      }}>
        {
          this.props.transactions
          .filter(({ status }) => status === "pending")
          .map((tx, index) => (
            <TouchableOpacity key={`bid-${index}`} onPress={() => (this.props.onPress(tx))}>
              <ListItem
                title={<Pending transaction={tx} />}
                leftIcon={{ name: "refresh" }}
              />
            </TouchableOpacity>
          ))
        }
        {
          this.props.transactions
          .filter(({ status }) => status === "finished")
          .map((tx, index) => (
            <TouchableOpacity key={`ask-${index}`} onPress={() => (this.props.onPress(tx))}>
              <ListItem
                title={<Finished transaction={tx} />}
                leftIcon={{ name: "" }}
              />
            </TouchableOpacity>
          ))
        }
      </List>
    );
  }
}

export default connect((state) => ({ ...state.device.layout, ...state.settings }), (dispatch) => ({ dispatch }))(TransactionsList);
