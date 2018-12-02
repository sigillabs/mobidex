import React from 'react';
import NavigationProvider from '../../../NavigationProvider';
import BaseToggleApproveScreen from './base';

export default class ToggleApproveScreen extends React.Component {
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
      <NavigationProvider>
        <BaseToggleApproveScreen {...this.props} />
      </NavigationProvider>
    );
  }
}
