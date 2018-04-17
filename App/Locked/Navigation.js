import React from 'react';
import { SwitchNavigator } from 'react-navigation';
import ImportPrivateKeyScreen from './screens/ImportPrivateKeyScreen';
import GenerateWalletScreen from './screens/GenerateWalletScreen';
import UnlockScreen from './screens/UnlockScreen';

export default SwitchNavigator(
  {
    Unlock: { screen: UnlockScreen },
    ImportPrivateKey: { screen: ImportPrivateKeyScreen },
    GenerateWallet: { screen: GenerateWalletScreen }
  },
  {
    initialRouteName: 'Unlock'
  }
);
