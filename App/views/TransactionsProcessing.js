import React, { Component } from "react";
import Splash from "../components/Splash";


export default class TransactionsProcessing extends Component {
  render() {
    let { txhash } = this.props;

    return (
        <Splash />
    );
  }
}
