import * as _ from "lodash";
import React, { Component } from "react";
import { View, Text } from "react-native";
import { Card } from "react-native-elements";
import { connect } from "react-redux";
import { setQuoteToken, setBaseToken } from "../../actions";
import TokenDropdown from "../components/TokenDropdown";

class TokenSettingsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      base: false,
      quote: false
    }
  }

  onSelect(setting) {
    let action = null;
    switch(setting) {
      case "base":
      action = setBaseToken;
      break;

      case "quote":
      action = setQuoteToken;
      break;
    }

    return (token) => {
      this.props.dispatch(action(token));
      this.setState({ base: false, quote: false });
    };
  }

  onPress(setting) {
    return (token) => {
      this.setState({ base: false, quote: false });
      this.setState({ [setting]: true })
    };
  }

  render() {
    return (
      <View>
        {this.state.quote ? null : <TokenDropdown
            title="Base Token"
            token={this.props.baseToken}
            show={this.state.base}
            onPress={this.onPress("base")}
            onSelect={this.onSelect("base")} />}
        {this.state.base ? null : <TokenDropdown
            title="Quote Token"
            token={this.props.quoteToken}
            show={this.state.quote}
            onPress={this.onPress("quote")}
            onSelect={this.onSelect("quote")} />}
      </View>
    );
  }
}

export default connect(state => ({ ...state.settings }), dispatch => ({ dispatch }))(TokenSettingsScreen);
