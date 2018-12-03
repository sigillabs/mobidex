import React from 'react';
import NavigationProvider from '../../../NavigationProvider';
import BaseReceiveScreen from './base';

export default class ReceiveScreen extends React.Component {
  static options() {
    return {
      topBar: {
        visible: true,
        drawBehind: false,
        backButton: {
          color: 'black'
        }
      }
    };
  }

  render() {
    return (
      <NavigationProvider>
        <BaseReceiveScreen {...this.props} />
      </NavigationProvider>
    );
  }
}
