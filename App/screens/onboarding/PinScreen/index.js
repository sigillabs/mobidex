import React from 'react';
import NavigationProvider from '../../../NavigationProvider';
import BasePinScreen from './base';

export default class PinScreen extends React.Component {
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
        <BasePinScreen {...this.props} />
      </NavigationProvider>
    );
  }
}
