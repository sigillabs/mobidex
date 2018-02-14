import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import { loadOrders } from "../../thunks";
import TransactionsList from "../components/TransactionsList";

class TransactionHistoryScreen extends Component {
  componentDidMount() {
    this.props.dispatch(loadOrders());
  }

  render() {
    return (
      <TransactionsList transactions={this.props.transactions} onPress={({ transactionId }) => ( /* link to etherscan */ {} )} />
    );
  }
}

export default connect((state) => ({ ...state.device, transactions: state.transactions }), (dispatch) => ({ dispatch }))(TransactionHistoryScreen);
