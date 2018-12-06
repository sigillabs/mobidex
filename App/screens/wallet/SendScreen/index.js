import React from 'react';
import NavigationProvider from '../../../NavigationProvider';
import BaseSendScreen from './base';

export default class SendScreen extends React.Component {
  static options() {
    return {
      topBar: {
        visible: true,
        drawBehind: false,
        backButton: {
          visible: true,
          color: 'black'
        }
      }
    };
  }

  render() {
    return (
      <NavigationProvider componentId={this.props.componentId}>
        <BaseSendScreen {...this.props} />
      </NavigationProvider>
    );
  }
}
