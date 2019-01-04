import React from 'react';
import NavigationProvider from '../../../NavigationProvider';
import BaseImportMnemonicScreen from './base';
import { StackNavigator } from 'react-navigation';

export default class ImportMnemonicScreen extends React.Component {
  static navigationOptions = { 
    header: null
  }; 

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
