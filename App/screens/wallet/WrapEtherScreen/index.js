import React, { Component } from 'react';
import NavigationProvider from '../../../NavigationProvider';
import BaseWrapEtherScreen from './base';

export default class WrapEtherScreen extends Component {
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
      <NavigationProvider componentId={this.props.componentId}>
        <BaseWrapEtherScreen {...this.props} />
      </NavigationProvider>
    );
  }
}
