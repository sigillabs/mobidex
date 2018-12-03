import React from 'react';
import NavigationProvider from '../../../NavigationProvider';
import BaseTransactionHistoryScreen from './base';

export default class TransactionHistoryScreen extends React.Component {
  static options() {
    return {
      topBar: {
        visible: true,
        drawBehind: false,
        backButton: {
          color: 'black'
        },
        title: {
          text: 'Transaction History',
          alignment: 'center'
        }
      }
    };
  }

  render() {
    return (
      <NavigationProvider>
        <BaseTransactionHistoryScreen {...this.props} />
      </NavigationProvider>
    );
  }
}
