import React from 'react';
import { StackNavigator, SwitchNavigator } from 'react-navigation';
import ImportPrivateKeyScreen from './Locked/ImportPrivateKeyScreen';
import UnlockScreen from './Locked/UnlockScreen';
import NormalHeader from './headers/Normal';
import ProductsHeader from './headers/Products';
import OrdersScreen from './Main/OrdersScreen';
import ProductScreen from './Main/ProductScreen';
import CreateOrderScreen from './Main/CreateOrderScreen';
import ProductDetailsScreen from './Main/ProductDetailsScreen';
import ReceiveScreen from './Main/ReceiveScreen';
import SendScreen from './Main/SendScreen';
import TransactionHistoryScreen from './Main/TransactionHistoryScreen';
import UnwrapEtherScreen from './Main/UnwrapEtherScreen';
import WrapEtherScreen from './Main/WrapEtherScreen';
import IntroScreen from './Onboarding/IntroScreen';
import ImportPrivateKey from './views/ImportPrivateKey';
import Err from './views/Error';
import LoadingScreen from './LoadingScreen';

import { colors } from '../styles';

const LockedNavigation = SwitchNavigator(
  {
    Unlock: { screen: UnlockScreen },
    ImportPrivateKey: { screen: ImportPrivateKeyScreen }
  },
  {
    initialRouteName: 'Unlock'
  }
);

const OnboardingNavigation = StackNavigator(
  {
    Intro: { screen: IntroScreen },
    Import: { screen: ImportPrivateKey }
  },
  {
    initialRouteName: 'Intro'
  }
);

const MainNavigation = StackNavigator(
  {
    List: { screen: ProductScreen },
    Details: { screen: ProductDetailsScreen },
    CreateOrder: { screen: CreateOrderScreen },
    Orders: { screen: OrdersScreen },
    History: { screen: TransactionHistoryScreen },
    Receive: { screen: ReceiveScreen },
    Send: { screen: SendScreen },
    Wrap: { screen: WrapEtherScreen },
    Unwrap: { screen: UnwrapEtherScreen }
  },
  {
    cardStyle: {
      backgroundColor: colors.background
    },
    initialRouteName: 'List',
    headerMode: 'float',
    navigationOptions: ({ navigation }) => {
      switch (navigation.state.routeName) {
        case 'List':
          return {
            header: <ProductsHeader navigation={navigation} />
          };

        default:
          return {
            header: <NormalHeader navigation={navigation} />
          };
      }
    }
  }
);

export default SwitchNavigator(
  {
    Loading: { screen: LoadingScreen },
    Error: { screen: Err },
    Onboarding: { screen: OnboardingNavigation },
    Main: { screen: MainNavigation },
    Locked: { screen: LockedNavigation }
  },
  {
    initialRouteName: 'Loading'
  }
);
