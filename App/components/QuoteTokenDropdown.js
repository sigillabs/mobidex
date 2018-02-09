import React, { Component } from "react";
import { connect } from "react-redux";
import TokenDropdown from "./TokenDropdown";
import { setQuoteToken } from "../../actions";

class QuoteTokenDropdown extends Component {
  render() {
    return (
      <TokenDropdown token={this.props.token} onSelect={(token) => {
        this.props.dispatch(setQuoteToken(token));
      }} />
    );
  }
}

export default connect(state => ({ token: state.settings.quoteToken }), dispatch => ({ dispatch }))(QuoteTokenDropdown);
