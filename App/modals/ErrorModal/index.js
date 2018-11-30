import React, { Component } from 'react';
import BaseErrorModal from './base';

export default class ErrorModal extends Component {
  static options() {
    return {
      topBar: {
        visible: false,
        drawBehind: true
      }
    };
  }

  render() {
    return <BaseErrorModal {...this.props} />;
  }
}
