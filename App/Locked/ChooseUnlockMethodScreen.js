import React, { Component } from 'react';
import * as WalletService from '../services/WalletService';
import NavigationService from '../services/NavigationService';

export default class ChooseUnlockMethodScreen extends Component {
  async UNSAFE_componentWillMount() {
    const supportsFingerPrint = await WalletService.supportsFingerPrintUnlock();
    if (supportsFingerPrint) {
      NavigationService.navigate('UnlockWithFinger');
    } else {
      NavigationService.navigate('UnlockWithPin');
    }
  }

  render() {
    return null;
  }
}
