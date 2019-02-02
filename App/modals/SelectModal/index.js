import React from 'react';
import NavigationProvider from '../../NavigationProvider';
import BaseSelectModal from './base';

export default class SelectModal extends React.Component {
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
        <BaseSelectModal {...this.props} />
      </NavigationProvider>
    );
  }
}
