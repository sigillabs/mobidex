import * as _ from "lodash";
import React, { Component } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import CurrencyDropdown from "../../components/CurrencyDropdown";
import { setQuoteToken, setBaseToken } from "../../actions";

class CurrencySettings extends Component {
  render() {
    return (
      <View>
        <Text>Quote Currency</Text>
        <CurrencyDropdown token={this.props.quoteToken} onSelect={(symbol) => {
          let token = _.find(this.props.tokens, { symbol });
          this.props.dispatch(setQuoteToken(token));
        }} />

        <Text>Base Currency</Text>
        <CurrencyDropdown token={this.props.baseToken} onSelect={(symbol) => {
          let token = _.find(this.props.tokens, { symbol });
          this.props.dispatch(setBaseToken(token));
        }} />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    tokens: state.ethereum.tokens,
    quoteToken: state.trade.settings.quoteToken,
    baseToken: state.trade.settings.baseToken
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

const ConnectedCurrencySettings = connect(mapStateToProps, mapDispatchToProps)(CurrencySettings);

export default ConnectedCurrencySettings;
