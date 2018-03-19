import React, { Component } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import { loadTransactions } from "../../thunks";
import TransactionsList from "../views/TransactionsList";

class TransactionHistoryScreen extends Component {
  componentDidMount() {
    this.props.dispatch(loadTransactions());
  }

  render() {
    return (
      <ScrollView>
        <TransactionsList transactions={this.props.transactions} onPress={({ transactionId }) => ( /* link to etherscan */ {} )} />
      </ScrollView>
    );
  }
}

export default connect((state) => ({ ...state.device, transactions: state.wallet.transactions }), (dispatch) => ({ dispatch }))(TransactionHistoryScreen);
