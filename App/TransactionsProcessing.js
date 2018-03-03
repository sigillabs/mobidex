import React, { Component } from "react";
import { Card } from "react-native-elements";

export default class TransactionsProcessing extends Component {
  render() {
    let { txhash } = this.props;

    return (
      <Card title="Processing Transactions" />
    );
  }
}
