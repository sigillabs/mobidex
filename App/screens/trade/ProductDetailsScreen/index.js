import React from 'react';
import NavigationProvider from '../../../NavigationProvider';
import BaseProductDetailsScreen from './base';

export default class ProductDetailsScreen extends React.Component {
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
        <BaseProductDetailsScreen {...this.props} />
      </NavigationProvider>
    );
  }
}
