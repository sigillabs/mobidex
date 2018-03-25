import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { List, ListItem, Text } from "react-native-elements";
import { connect } from "react-redux";
import TinyHeader from "../../components/TinyHeader";
import CancelledItem from "./CancelledItem";
import FilledItem from "./FilledItem";

class TransactionsList extends Component {
  render() {
    return (
      <View>
        <TinyHeader>Filled</TinyHeader>
        <List containerStyle={{
          flex: 1,
          width: this.props.width,
          marginTop: 3,
          marginBottom: 10
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
        <TinyHeader>Cancelled</TinyHeader>
        <List containerStyle={{
          flex: 1,
          width: this.props.width,
          marginTop: 3,
          marginBottom: 10
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
      </View>
    );
  }
}

export default connect((state) => ({ ...state.device.layout, ...state.settings }), (dispatch) => ({ dispatch }))(TransactionsList);
