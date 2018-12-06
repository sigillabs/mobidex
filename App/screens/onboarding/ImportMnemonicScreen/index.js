import React from 'react';
import NavigationProvider from '../../../NavigationProvider';
import BaseImportMnemonicScreen from './base';

export default class ImportMnemonicScreen extends React.Component {
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
      <NavigationProvider componentId={this.props.componentId}>
        <BaseImportMnemonicScreen {...this.props} />
      </NavigationProvider>
    );
  }
}
