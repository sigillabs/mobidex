import React from 'react';
import NavigationProvider from '../../../NavigationProvider';
import BaseProductScreen from './base';

export default class ProductScreen extends React.Component {
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
    return (
      <NavigationProvider>
        <BaseProductScreen {...this.props} />
      </NavigationProvider>
    );
  }
}
