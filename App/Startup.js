import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { setError } from "../actions";
import { loadAssets, loadWallet, loadProductsAndTokens, unlock } from "../thunks";
import Err from "./Error";
import Main from "./Main";
import Locked from "./Locked";
import TransactionsProcessing from "./TransactionsProcessing";

class Startup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      finished: false
    };
  }

  onFinish = async () => {
    try {
      await this.props.dispatch(loadProductsAndTokens());
      await this.props.dispatch(loadAssets());
      this.setState({ finished: true })
    } catch(err) {
      setError(err);
    }
  };

  render() {
    if (this.props.error) {
      return <Err error={this.props.error} />;
    }

    if (this.props.txhash) {
      return <TransactionsProcessing txhash={this.props.txhash} />;
    }

    if (!this.props.web3 || !this.state.finished) {
      return (
        <Locked onFinish={this.onFinish} />
      );
    }

    return (
      <Main />
    );
  }
}

export default connect((state) => ({ web3: state.wallet.web3, txhash: state.wallet.txhash, error: state.error }), dispatch => ({ dispatch }))(Startup);
