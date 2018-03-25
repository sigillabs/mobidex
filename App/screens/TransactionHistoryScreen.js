import React, { Component } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { connect } from "react-redux";
import { loadTransactions } from "../../thunks";
import TransactionsList from "../views/TransactionsList";

class TransactionHistoryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false
    };
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.props.dispatch(loadTransactions());
    this.setState({ refreshing: false });
  };

  componentDidMount() {
    this.props.dispatch(loadTransactions());
  }

  render() {
    return (
      <ScrollView refreshControl={(
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh.bind(this)}
        />
      )}>
        <TransactionsList transactions={this.props.transactions} />
      </ScrollView>
    );
  }
}

export default connect((state) => ({ ...state.device, transactions: state.wallet.transactions }), (dispatch) => ({ dispatch }))(TransactionHistoryScreen);
