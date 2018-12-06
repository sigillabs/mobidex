import React, { Component } from 'react';
import NavigationProvider from '../../NavigationProvider';
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
    return (
      <NavigationProvider componentId={this.props.componentId}>
        <BaseErrorModal {...this.props} />
      </NavigationProvider>
    );
  }
}
