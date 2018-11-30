import React, { Component } from 'react';
import BasePreviewOrderModal from './base';

export default class PreviewOrderModal extends Component {
  static options() {
    return {
      topBar: {
        visible: false,
        drawBehind: true
      }
    };
  }

  render() {
    return <BasePreviewOrderModal {...this.props} />;
  }
}
