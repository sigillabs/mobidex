import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import AddressText from '../../components/AddressText';
import MutedText from '../../components/MutedText';
import Row from '../../components/Row';
import { formatTimestamp } from '../../../utils';

class TransactionItem extends Component {
  render() {
    const { action } = this.props;

    switch (action) {
      case 'MARKET_BUY':
      case 'MARKET_SELL':
      case 'MARKET_BUY_WITH_ETH':
      case 'MARKET_SELL_ETH':
      case 'FILL':
      case 'CANCEL':
        return this.renderFillOrCancel();

      case 'SEND_ETHER':
      case 'SEND_TOKENS':
        return this.renderSend();

      case 'DEPOSIT':
      case 'WITHDRAWAL':
        return this.renderDepositOrWithdrawal();

      case 'APPROVAL':
        return this.renderApproval();

      default:
        return this.renderDefault();
    }
  }

  renderApproval() {
    const { label, destination, timestamp } = this.props;

    return (
      <ListItem
        title={
          <Row>
            <Text>{label}</Text>
            <Text> </Text>
            <Text>{destination ? destination.symbol : null}</Text>
            <Text> </Text>
            <Text>{destination ? destination.amount : null}</Text>
          </Row>
        }
        subtitle={
          timestamp ? <MutedText>{formatTimestamp(timestamp)}</MutedText> : null
        }
        borderBottom
      />
    );
  }

  renderDepositOrWithdrawal() {
    const { label, source, timestamp } = this.props;

    return (
      <ListItem
        title={
          <Row>
            <Text>{label}</Text>
            <Text> </Text>
            <Text>{source ? source.amount : null}</Text>
            <Text> </Text>
            <Text>ETH</Text>
          </Row>
        }
        subtitle={
          timestamp ? <MutedText>{formatTimestamp(timestamp)}</MutedText> : null
        }
        borderBottom
      />
    );
  }

  renderFillOrCancel() {
    const { label, source, destination, timestamp } = this.props;

    return (
      <ListItem
        title={
          <Row>
            <Text>{label}</Text>
            <Text> </Text>
            <Text>{source ? source.amount : null}</Text>
            <Text> </Text>
            <Text>{source ? source.symbol : null}</Text>
            <Text>{source && destination ? ' for ' : null}</Text>
            <Text>{destination.amount}</Text>
            <Text> </Text>
            <Text>{destination.symbol}</Text>
          </Row>
        }
        subtitle={
          timestamp ? <MutedText>{formatTimestamp(timestamp)}</MutedText> : null
        }
        borderBottom
      />
    );
  }

  renderSend() {
    const { label, source, destination, timestamp } = this.props;

    return (
      <ListItem
        title={
          <Row>
            <Text>{label}</Text>
            <Text> </Text>
            <Text>{source.amount}</Text>
            <Text> </Text>
            <Text>{source.symbol}</Text>
            <Text> to </Text>
            <AddressText address={destination.address} summarize={true} />
          </Row>
        }
        subtitle={
          timestamp ? <MutedText>{formatTimestamp(timestamp)}</MutedText> : null
        }
        borderBottom
      />
    );
  }

  renderDefault() {
    const { label, amount, symbol, timestamp } = this.props;

    return (
      <ListItem
        title={
          <Row>
            <Text>{label}</Text>
            <Text> </Text>
            <Text>{amount}</Text>
            <Text> </Text>
            <Text>{symbol}</Text>
          </Row>
        }
        subtitle={
          timestamp ? <MutedText>{formatTimestamp(timestamp)}</MutedText> : null
        }
        borderBottom
      />
    );
  }
}

TransactionItem.propTypes = {
  action: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  amount: PropTypes.number,
  symbol: PropTypes.string,
  address: PropTypes.string,
  source: PropTypes.shape({
    address: PropTypes.string,
    amount: PropTypes.number,
    symbol: PropTypes.string
  }),
  destination: PropTypes.shape({
    address: PropTypes.string,
    amount: PropTypes.number,
    symbol: PropTypes.string
  }),
  processing: PropTypes.bool,
  timestamp: PropTypes.string
};

export default connect(
  state => ({
    address: state.wallet.address
  }),
  dispatch => ({ dispatch })
)(TransactionItem);
