import React from 'react';
import { StackNavigator } from 'react-navigation';
import Intro from './Intro';
import GenerateWallet from '../views/GenerateWallet';
import ImportPrivateKey from '../views/ImportPrivateKey';


export default StackNavigator(
  {
    Intro: { screen: Intro },
    NewWallet: { screen: GenerateWallet },
    Import: { screen: ImportPrivateKey }
  },
  {
    initialRouteName: 'Intro',
  }
);
