import React, { Component } from "react";
import { Text } from "react-native";
import ModalDropdown from "react-native-modal-dropdown";
import { connect } from "react-redux";
import { gotoOrders } from "../../thunks"

class CurrencyDropdown extends Component {
  render() {
    return (
      <ModalDropdown animated={false} options={this.props.tokens.map(token => token.symbol)} onSelect={(index, value) => {
        this.props.onSelect(value);
      }}>
        <Text>{this.props.token.symbol}</Text>
      </ModalDropdown>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    tokens: state.ethereum.tokens
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

const ConnectedCurrencyDropdown = connect(mapStateToProps, mapDispatchToProps)(CurrencyDropdown);

export default ConnectedCurrencyDropdown;
