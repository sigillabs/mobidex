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
          color: 'black'
        },
        title: {
          component: {
            name: 'header.LogoTicker',
            alignment: 'center',
            passProps
          }
        }
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
