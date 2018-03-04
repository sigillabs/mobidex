import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { List, ListItem, Text } from "react-native-elements";
import { connect } from "react-redux";
import GlobalStyles from "../../../styles";
import CancelledItem from "./CancelledItem";
import FilledItem from "./FilledItem";

class TransactionsList extends Component {
  render() {
    return (
      <ScrollView>
      <Text style={GlobalStyles.tinyheader}>Filled</Text>
        <List containerStyle={{
          flex: 1,
          width: this.props.width
        }}>
          {
            this.props.transactions
            .filter(({ status }) => status === "FILLED")
            .map((tx, index) => (
              <TouchableOpacity key={`filled-${index}`} onPress={() => (this.props.onPress(tx))}>
                <ListItem title={<FilledItem transaction={tx} />} />
              </TouchableOpacity>
            ))
          }
        </List>
        <Text style={GlobalStyles.tinyheader}>Cancelled</Text>
        <List containerStyle={{
          flex: 1,
          width: this.props.width
        }}>
          {
            this.props.transactions
            .filter(({ status }) => status === "CANCELLED")
            .map((tx, index) => (
              <TouchableOpacity key={`cancelled-${index}`} onPress={() => (this.props.onPress(tx))}>
                <ListItem title={<CancelledItem transaction={tx} />} />
              </TouchableOpacity>
            ))
          }
        </List>
      </ScrollView>
    );
  }
}

export default connect((state) => ({ ...state.device.layout, ...state.settings }), (dispatch) => ({ dispatch }))(TransactionsList);
