import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { setError } from "../actions";
import { loadAssets, loadWallet, loadProductsAndTokens } from "../thunks";

class Startup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      finished: false
    }
  }

  async componentDidMount(nextProps) {
    try {
      await this.props.dispatch(loadWallet());
      await this.props.dispatch(loadProductsAndTokens());
      await this.props.dispatch(loadAssets(true));
    } catch(err) {
      setError(err);
    } finally {
      this.setState({ finished: true });
    }
  }

  render() {
    let Splash = this.props.splashComponent;
    let Main = this.props.mainComponent;
    let Onboarding = this.props.onboardingComponent;
    let Err = this.props.errorComponent;

    if (this.props.error) {
      return <Err error={this.props.error} />;
    }

    if (!this.state.finished) {
      return (
        <Splash />
      );
    }

    if (!this.props.web3) {
      return (
        <Onboarding />
      );
    }

    return (
      <Main />
    );
  }
}

export default connect((state) => ({ web3: state.wallet.web3, error: state.error }), dispatch => ({ dispatch }))(Startup);
