import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import Item from "./Item";

class TransactionsList extends Component {
  render() {
    return (
      <ScrollView>
        <List containerStyle={{
          flex: 1,
          width: this.props.width
        }}>
          {
            this.props.transactions
            .filter(({ status }) => status === "FILLED" || status === "CANCELLED")
            .map((tx, index) => (
              <TouchableOpacity key={`ask-${index}`} onPress={() => (this.props.onPress(tx))}>
                <ListItem title={<Item transaction={tx} />} />
              </TouchableOpacity>
            ))
          }
        </List>
      </ScrollView>
    );
  }
}

export default connect((state) => ({ ...state.device.layout, ...state.settings }), (dispatch) => ({ dispatch }))(TransactionsList);
