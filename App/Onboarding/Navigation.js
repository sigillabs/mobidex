import React from 'react';
import { StackNavigator } from 'react-navigation';
import Intro from './Intro';
import GenerateWallet from '../views/GenerateWallet';

export default StackNavigator(
  {
    Intro: { screen: Intro },
    NewWallet: { screen: GenerateWallet }
  },
  {
    initialRouteName: 'Intro'
  }
);
