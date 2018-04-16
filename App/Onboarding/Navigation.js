import React from 'react';
import { StackNavigator } from 'react-navigation';
import Intro from './Intro';

export default StackNavigator(
  {
    Intro: { screen: Intro }
  },
  {
    initialRouteName: 'Intro'
  }
);
