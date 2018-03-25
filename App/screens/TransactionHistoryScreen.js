import React, { Component } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { connect } from "react-redux";
import { loadTransactions } from "../../thunks";
import EmptyList from "../components/EmptyList";
import MutedText from "../components/MutedText";
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
        {this.props.transactions.length > 0 ? (
          <TransactionsList transactions={this.props.transactions} />
        ) : (
          <EmptyList style={{ height: "100%", width: "100%" }}>
            <MutedText style={{ marginTop: 25 }}>No transaction history to show.</MutedText>
          </EmptyList>
        )}
      </ScrollView>
    );
  }
}

export default connect((state) => ({ ...state.device, transactions: state.wallet.transactions }), (dispatch) => ({ dispatch }))(TransactionHistoryScreen);
