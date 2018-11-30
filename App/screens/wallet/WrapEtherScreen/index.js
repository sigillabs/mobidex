import React, { Component } from 'react';
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
    return <BaseWrapEtherScreen {...this.props} />;
  }
}
