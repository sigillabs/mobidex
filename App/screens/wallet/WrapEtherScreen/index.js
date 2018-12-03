import React, { Component } from 'react';
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
    return <BaseWrapEtherScreen {...this.props} />;
  }
}
