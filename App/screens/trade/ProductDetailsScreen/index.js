import React, { Component } from 'react';
import BaseProductDetailsScreen from './base';

export default class ProductDetailsScreen extends Component {
  static options(passProps) {
    return {
      topBar: {
        visible: true,
        drawBehind: false,
        backButton: {
          visible: true,
          color: 'black'
        },
        title: {
          component: {
            name: 'header.LogoTicker',
            alignment: 'center',
            passProps
          }
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
    return <BaseProductDetailsScreen {...this.props} />;
  }
}
