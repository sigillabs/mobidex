import React from 'react';
import NavigationProvider from '../../NavigationProvider';
import BaseConstructWalletModal from './base';

export default class ConstructWalletModal extends React.Component {
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
        <BaseConstructWalletModal {...this.props} />
      </NavigationProvider>
    );
  }
}
