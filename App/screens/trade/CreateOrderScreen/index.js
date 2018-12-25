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
            name: 'header.LogoBalance',
            alignment: 'center',
            passProps: {
              symbol:
                passProps.side === 'buy'
                  ? passProps.quote.symbol
                  : passProps.base.symbol
            }
          }
        }
      }
    };
  }

  render() {
    return (
      <NavigationProvider componentId={this.props.componentId}>
        <BaseCreateOrderScreen {...this.props} />
      </NavigationProvider>
    );
  }
}
