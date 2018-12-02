import React, { Component } from 'react';
import NavigationProvider from '../../../NavigationProvider';
import BaseCreateOrderScreen from './base';

export default class CreateOrderScreen extends Component {
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
    return (
      <NavigationProvider>
        <BaseCreateOrderScreen {...this.props} />
      </NavigationProvider>
    );
  }
}
