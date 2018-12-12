import React, { Component } from 'react';
import { checkOrRequestExternalStorageRead } from '../../../navigation';
import NavigationProvider from '../../NavigationProvider';
import BaseUnlockAndSignModal from './base';

export default class UnlockAndSignModal extends Component {
  static options() {
    return {
      topBar: {
        visible: false,
        drawBehind: true
      }
    };
  }

  componentDidMount() {
    checkOrRequestExternalStorageRead();
  }

  render() {
    return (
      <NavigationProvider componentId={this.props.componentId}>
        <BaseUnlockAndSignModal {...this.props} />
      </NavigationProvider>
    );
  }
}
