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
      <NavigationProvider componentId={this.props.componentId}>
        <BasePinScreen {...this.props} />
      </NavigationProvider>
    );
  }
}
