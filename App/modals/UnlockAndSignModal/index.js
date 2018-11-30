import React, { Component } from 'react';
import BaseUnlockAndSignModal from './base';

export default class UnlockAndSignModal extends Component {
  static options() {
    return {
      topBar: {
        visible: false,
        drawBehind: true
      }
    };
  }

  render() {
    return <BaseUnlockAndSignModal {...this.props} />;
  }
}
