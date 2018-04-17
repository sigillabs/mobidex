import React from 'react';
import { SwitchNavigator } from 'react-navigation';
import LockedNavigation from '../Locked/Navigation';
import TransactionsProcessing from '../views/TransactionsProcessing';
import Err from '../views/Error';
import OnboardingNavigation from './Onboarding';
import MainNavigation from './Main';

export default SwitchNavigator(
  {
    Loading: { screen: TransactionsProcessing },
    Error: { screen: Err },
    Onboarding: { screen: OnboardingNavigation },
    Main: { screen: MainNavigation },
    Locked: { screen: LockedNavigation }
  },
  {
    initialRouteName: 'Loading'
  }
);
