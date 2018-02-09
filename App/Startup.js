import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { finishedStartup } from "../actions";
import { loadWallet, loadTokens } from "../thunks";

class Startup extends Component {
  componentDidMount() {
    this.props.dispatch(loadWallet());
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.wallet && !nextProps.tokens) {
      this.props.dispatch(loadTokens(nextProps.web3))
    }
  }

  render() {
    let Splash = this.props.splashComponent;
    let Navigator = this.props.navigatorComponent;
    let Onboarding = this.props.onboardingComponent;

    if (this.props.wallet && this.props.tokens) {
      if (this.props.web3) {
        return (
          <Navigator />
        );
      } else {
        return (
          <Onboarding />
        );
      }
    } else {
      return (
        <Splash />
      );
    }

    
  }
}

export default connect((state) => ({ ...state.startup, web3: state.wallet.web3 }), dispatch => ({ dispatch }))(Startup);
