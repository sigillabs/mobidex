import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import NumberOverlay from '../components/NumberOverlay';

export class ActiveTransactionsOverlay extends Component {
  render() {
    return (
      <NumberOverlay
        {...this.props}
        value={this.props.activeTransactions.length}
      />
    );
  }
}

ActiveTransactionsOverlay.propTypes = {
  children: PropTypes.any,
  activeTransactions: PropTypes.array.isRequired
};

export default connect(({ wallet: { activeTransactions } }) => ({
  activeTransactions
}))(ActiveTransactionsOverlay);
