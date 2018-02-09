import * as _ from "lodash";
import React, { Component } from "react";
import { Text } from "react-native";
import ModalDropdown from "react-native-modal-dropdown";
import { connect } from "react-redux";
import { gotoOrders } from "../../thunks"

class TokenDropdown extends Component {
  render() {
    return (
      <ModalDropdown animated={false} options={this.props.tokens.map(token => token.symbol)} onSelect={(index, value) => {
        this.props.onSelect(_.find(this.props.tokens, { symbol: value }));
      }}>
        <Text>{this.props.token.symbol}</Text>
      </ModalDropdown>
    );
  }
}

export default connect(state => ({ tokens: state.tokens }), dispatch => ({ dispatch }))(TokenDropdown);
