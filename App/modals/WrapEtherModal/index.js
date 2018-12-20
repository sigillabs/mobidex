import React, { Component } from 'react';
import NavigationProvider from '../../NavigationProvider';
import BaseWrapEtherScreen from './base';

export default class WrapEtherScreen extends Component {
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
        <BaseWrapEtherScreen {...this.props} />
      </NavigationProvider>
    );
  }
}
