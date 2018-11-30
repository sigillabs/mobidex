import React, { Component } from 'react';
import BaseProductScreen from './base';

export default class ProductScreen extends Component {
  static options() {
    return {
      topBar: {
        visible: true,
        drawBehind: false,
        backButton: {
          visible: true,
          color: 'black'
        },
        title: {
          text: 'Trade'
        },
        rightButtons: [
          {
            id: 'toggleForexButton',
            text: 'ETH',
            color: 'black'
          }
        ]
      }
    };
  }

  render() {
    return <BaseProductScreen {...this.props} />;
  }
}
