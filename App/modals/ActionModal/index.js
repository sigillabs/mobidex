import React from 'react';
import NavigationProvider from '../../NavigationProvider';
import BaseActionModal from './base';

export default class ActionModal extends React.Component {
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
        <BaseActionModal {...this.props} />
      </NavigationProvider>
    );
  }
}
