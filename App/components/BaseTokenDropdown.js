import React, { Component } from "react";
import { connect } from "react-redux";
import TokenDropdown from "./TokenDropdown";
import { setBaseToken } from "../../actions";

class BaseTokenDropdown extends Component {
  render() {
    return (
      <TokenDropdown token={this.props.token} onSelect={(token) => {
        this.props.dispatch(setBaseToken(token));
      }} />
    );
  }
}

export default connect(state => ({ token: state.settings.baseToken }), dispatch => ({ dispatch }))(BaseTokenDropdown);
