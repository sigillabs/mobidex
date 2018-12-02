import React from 'react';
import NavigationProvider from '../../../NavigationProvider';
import BaseAccountsScreen from './base';

export default class AccountsScreen extends React.Component {
  static options() {
    return {
      topBar: {
        visible: false,
        drawBehind: true
      }
    };
  }

  render() {
    return (
      <NavigationProvider>
        <BaseAccountsScreen {...this.props} />
      </NavigationProvider>
    );
  }
}
