import React, { Component } from 'react';
import NavigationProvider from '../../NavigationProvider';
import BaseReceiptModal from './base';

export default class ReceiptModal extends Component {
  static options() {
    return {
      topBar: {
        visible: false,
        drawBehind: true
      }
    };
  }

  render() {
    return (
      <NavigationProvider componentId={this.props.componentId}>
        <BaseReceiptModal {...this.props} />
      </NavigationProvider>
    );
  }
}
