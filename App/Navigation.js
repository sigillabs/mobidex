import React from 'react';
import { StackNavigator, SwitchNavigator } from 'react-navigation';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import ImportPrivateKeyScreen from './Locked/screens/ImportPrivateKeyScreen';
import GenerateWalletScreen from './Locked/screens/GenerateWalletScreen';
import UnlockScreen from './Locked/screens/UnlockScreen';

import BlankHeader from './Main/headers/Blank';
import NormalHeader from './Main/headers/Normal';
import TradingHeader from './Main/headers/Trading';
import TokenDetailsScreen from './Main/screens/TokenDetailsScreen';
// import PortfolioScreen from './Main/screens/PortfolioScreen';
import TradingScreen from './Main/screens/TradingScreen';
import CreateOrderScreen from './Main/screens/CreateOrderScreen';
import OrderDetailsScreen from './Main/screens/OrderDetailsScreen';
import ReceiveScreen from './Main/screens/ReceiveScreen';
import SendScreen from './Main/screens/SendScreen';
import TransactionHistoryScreen from './Main/screens/TransactionHistoryScreen';
import UnwrapEtherScreen from './Main/screens/UnwrapEtherScreen';
import WrapEtherScreen from './Main/screens/WrapEtherScreen';

import Intro from './Onboarding/Intro';

import GenerateWallet from './views/GenerateWallet';
import ImportPrivateKey from './views/ImportPrivateKey';
import TransactionsProcessing from './views/TransactionsProcessing';
import Err from './views/Error';

const LockedNavigation = SwitchNavigator(
  {
    Unlock: { screen: UnlockScreen },
    ImportPrivateKey: { screen: ImportPrivateKeyScreen },
    GenerateWallet: { screen: GenerateWalletScreen }
  },
  {
    initialRouteName: 'Unlock'
  }
);

const OnboardingNavigation = StackNavigator(
  {
    Intro: { screen: Intro },
    NewWallet: { screen: GenerateWallet },
    Import: { screen: ImportPrivateKey }
  },
  {
    initialRouteName: 'Intro'
  }
);

const MainNavigation = StackNavigator(
  {
    List: { screen: TradingScreen },
    CreateOrder: { screen: CreateOrderScreen },
    OrderDetails: { screen: OrderDetailsScreen },
    History: { screen: TransactionHistoryScreen },
    // Portfolio: { screen: PortfolioScreen },
    Receive: { screen: ReceiveScreen },
    Send: { screen: SendScreen },
    Wrap: { screen: WrapEtherScreen },
    Unwrap: { screen: UnwrapEtherScreen }
  },
  {
    initialRouteName: 'List',
    headerMode: 'float',
    navigationOptions: ({ navigation }) => {
      switch (navigation.state.routeName) {
        case 'List':
          return { header: <TradingHeader navigation={navigation} /> };
        default:
          return { header: <NormalHeader navigation={navigation} /> };
      }
    }
  }
);

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
