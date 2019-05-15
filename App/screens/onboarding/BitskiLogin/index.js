import React from 'react';
import NavigationProvider from '../../../NavigationProvider';
import BaseBitskiLoginScreen from './base';

export default class BitskiLoginScreen extends React.Component {
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
        <BaseBitskiLoginScreen {...this.props} />
      </NavigationProvider>
    );
  }
}
