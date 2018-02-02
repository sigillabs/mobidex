import React, { Component } from "react";
import ThreadBase from "./ThreadBase";

export default class NetworkChangeThready extends ThreadBase {
  constructor(props, context) {
    super(props, context);

    this.state = {
      network: null
    };
  }

  execute(cb) {
    if (this.props.ethereum !== null) {
      console.warn(this.props.ethereum);
    }
  }
}
