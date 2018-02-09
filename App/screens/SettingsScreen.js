import * as _ from "lodash";
import React, { Component } from "react";
import { View, Text } from "react-native";
import { Card } from "react-native-elements";
import { connect } from "react-redux";
import { setQuoteToken, setBaseToken } from "../../actions";
import BaseTokenDropdown from "../components/BaseTokenDropdown";
import QuoteTokenDropdown from "../components/QuoteTokenDropdown";

export default class SettingsScreen extends Component {
  render() {
    return (
      <View>
        <Text>Quote Currency</Text>
        <QuoteTokenDropdown />

        <Text>Base Currency</Text>
        <BaseTokenDropdown />
      </View>
    );
  }
}
