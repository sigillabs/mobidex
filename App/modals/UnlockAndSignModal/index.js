import React, { Component } from 'react';
import NavigationProvider from '../../NavigationProvider';
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
    return (
      <NavigationProvider componentId={this.props.componentId}>
        <BaseUnlockAndSignModal {...this.props} />
      </NavigationProvider>
    );
  }
}
