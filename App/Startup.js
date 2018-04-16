import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { setError } from '../actions';
import {
  loadAssets,
  loadWallet,
  loadProductsAndTokens,
  unlock
} from '../thunks';
import { hasWalletOnFileSystem } from '../utils';
import Main from './Main';
import Onboarding from './Onboarding';
import Locked from './views/Locked';
import Err from './views/Error';
import TransactionsProcessing from './views/TransactionsProcessing';

class Startup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      hasWallet: false,
      finished: false
    };
  }

  async componentDidMount() {
    this.setState({
      ready: true,
      hasWallet: await hasWalletOnFileSystem()
    });
  }

  onFinish = async () => {
    try {
      await this.props.dispatch(loadProductsAndTokens());
      await this.props.dispatch(loadAssets());
      this.setState({ finished: true });
    } catch (err) {
      setError(err);
    }
  };

  render() {
    if (!this.state.ready) {
      return <TransactionsProcessing />;
    }

    if (!this.state.hasWallet) {
      return <Onboarding />;
    }

    if (this.props.error) {
      return <Err error={this.props.error} />;
    }

    if (this.props.processing) {
      return <TransactionsProcessing />;
    }

    if (!this.props.web3 || !this.state.finished) {
      return <Locked onFinish={this.onFinish} />;
    }

    return <Main />;
  }
}

export default connect(
  state => ({
    web3: state.wallet.web3,
    processing: state.wallet.processing,
    error: state.error
  }),
  dispatch => ({ dispatch })
)(Startup);
