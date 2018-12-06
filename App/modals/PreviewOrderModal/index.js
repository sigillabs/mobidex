import React, { Component } from 'react';
import NavigationProvider from '../../NavigationProvider';
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
    return (
      <NavigationProvider componentId={this.props.componentId}>
        <BasePreviewOrderModal {...this.props} />
      </NavigationProvider>
    );
  }
}
