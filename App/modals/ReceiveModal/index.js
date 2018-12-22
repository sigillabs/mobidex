import React from 'react';
import NavigationProvider from '../../NavigationProvider';
import BaseReceiveScreen from './base';

export default class ReceiveModal extends React.Component {
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
        <BaseReceiveScreen {...this.props} />
      </NavigationProvider>
    );
  }
}
