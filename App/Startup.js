import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { setError } from "../actions";
import { loadAssets, loadWallet, loadProductsAndTokens } from "../thunks";
import Err from "./Error";
import Main from "./Main";
import Onboarding from "./Onboarding";
import Splash from "./Splash";
import TransactionsProcessing from "./TransactionsProcessing";

class Startup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      finished: false
    }
  }

  async componentDidMount(nextProps) {
    try {
      if (await this.props.dispatch(loadWallet())) {
        await this.props.dispatch(loadProductsAndTokens());
        await this.props.dispatch(loadAssets());
      }
    } catch(err) {
      setError(err);
    } finally {
      this.setState({ finished: true });
    }
  }

  render() {
    if (this.props.error) {
      return <Err error={this.props.error} />;
    }

    if (this.props.txhash) {
      return <TransactionsProcessing txhash={this.props.txhash} />;
    }

    if (!this.state.finished) {
      return (
        <Splash />
      );
    }

    if (!this.props.web3) {
      return (
        <Onboarding onFinish={async () => {
          try {
            await this.props.dispatch(loadProductsAndTokens());
            await this.props.dispatch(loadAssets(true));
          } catch(err) {
            setError(err);
          } finally {
            this.setState({ finished: true });
          }
        }} />
      );
    }

    return (
      <Main />
    );
  }
}

export default connect((state) => ({ web3: state.wallet.web3, txhash: state.wallet.txhash, error: state.error }), dispatch => ({ dispatch }))(Startup);
