import React from 'react';
import NavigationProvider from '../../NavigationProvider';
import BaseInitialLoadScreen from './base';

export default class InitialLoadScreen extends React.Component {
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
        <BaseInitialLoadScreen {...this.props} />
      </NavigationProvider>
    );
  }
}


