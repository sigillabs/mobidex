import React, { Component } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import TransactionsList from './List';
import { loadTransactions } from '../../../thunks';
import EmptyList from '../../components/EmptyList';
import MutedText from '../../components/MutedText';
import PageRoot from '../../components/PageRoot';
import Tabs from '../Tabs';

class TransactionHistoryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    this.onRefresh();
  }

  render() {
    const allTransactions = []
      .concat(this.props.activeTransactions)
      .concat(this.props.transactions);
    return (
      <PageRoot>
        <Tabs index={2} />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh()}
            />
          }
        >
          {allTransactions.length > 0 ? (
            <TransactionsList
              active={this.props.activeTransactions}
              transactions={this.props.transactions}
            />
          ) : (
            <EmptyList style={{ height: '100%', width: '100%' }}>
              <MutedText style={{ marginTop: 25 }}>
                No transaction history to show.
              </MutedText>
            </EmptyList>
          )}
        </ScrollView>
      </PageRoot>
    );
  }

  async onRefresh() {
    this.setState({ refreshing: true });
    await this.props.dispatch(loadTransactions());
    this.setState({ refreshing: false });
  }
}

export default connect(
  state => ({
    ...state.device,
    activeTransactions: state.wallet.activeTransactions,
    transactions: state.wallet.transactions
  }),
  dispatch => ({ dispatch })
)(TransactionHistoryScreen);
