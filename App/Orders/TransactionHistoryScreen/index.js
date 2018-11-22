import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SectionList } from 'react-native';
import { connect } from 'react-redux';
import { gotoEtherScan, loadTransactions } from '../../../thunks';
import EmptyList from '../../components/EmptyList';
import MutedText from '../../components/MutedText';
import AdaptTransactionItem from './AdaptTransactionItem';

class TransactionHistoryScreen extends Component {
  static get propTypes() {
    return {
      transactions: PropTypes.array.isRequired,
      activeTransactions: PropTypes.array.isRequired,
      dispatch: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    this.onRefresh(false);
  }

  render() {
    const sections = [];

    if (this.props.activeTransactions.length > 0) {
      sections.push({
        title: 'Active Transactions',
        data: this.props.activeTransactions
      });
    }

    if (this.props.transactions.length > 0) {
      sections.push({ title: 'Transactions', data: this.props.transactions });
    }

    return (
      <SectionList
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        keyExtractor={this.keyExtractor}
        ListEmptyComponent={this.renderEmpty}
        sections={sections}
      />
    );
  }

  renderEmpty = () => {
    return (
      <EmptyList style={{ height: '100%', width: '100%' }}>
        <MutedText style={{ marginTop: 25 }}>
          No transaction history to show.
        </MutedText>
      </EmptyList>
    );
  };

  renderItem = ({ item }, index, section) => (
    <AdaptTransactionItem
      transaction={item}
      onPress={() => this.props.dispatch(gotoEtherScan(item.id))}
    />
  );

  renderSectionHeader = () => null;

  keyExtractor = (item, index) => index;

  onRefresh = async (reload = true) => {
    this.setState({ refreshing: true });
    await this.props.dispatch(loadTransactions(reload));
    this.setState({ refreshing: false });
  };
}

export default connect(
  state => ({
    ...state.device,
    activeTransactions: state.wallet.activeTransactions,
    transactions: state.wallet.transactions
  }),
  dispatch => ({ dispatch })
)(TransactionHistoryScreen);
