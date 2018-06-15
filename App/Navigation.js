import React from 'react';
import {
  createStackNavigator,
  createSwitchNavigator,
  createTabNavigator
} from 'react-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImportPrivateKeyScreen from './Locked/ImportPrivateKeyScreen';
import UnlockScreen from './Locked/UnlockScreen';
import NormalHeader from './headers/Normal';
import ProductsHeader from './headers/Products';
import BlankHeader from './headers/Blank';
import ProductScreen from './Main/ProductScreen';
import CreateOrderScreen from './Main/CreateOrderScreen';
import ProductDetailsScreen from './Main/ProductDetailsScreen';
import AccountsScreen from './Wallet/AccountsScreen';
import OrdersScreen from './Wallet/OrdersScreen';
import ReceiveScreen from './Wallet/ReceiveScreen';
import SendScreen from './Wallet/SendScreen';
import TransactionHistoryScreen from './Wallet/TransactionHistoryScreen';
import UnwrapEtherScreen from './Wallet/UnwrapEtherScreen';
import WrapEtherScreen from './Wallet/WrapEtherScreen';
import IntroScreen from './Onboarding/IntroScreen';
import ErrorScreen from './Error';
import SettingsScreen from './SettingsScreen.js';
import LoadingScreen from './LoadingScreen';
import { colors } from '../styles';

const LockedNavigation = createSwitchNavigator(
  {
    Unlock: { screen: UnlockScreen },
    ImportPrivateKey: { screen: ImportPrivateKeyScreen }
  },
  {
    initialRouteName: 'Unlock'
  }
);

const OnboardingNavigation = createStackNavigator(
  {
    Intro: { screen: IntroScreen }
  },
  {
    initialRouteName: 'Intro',
    headerMode: 'none'
  }
);

const WalletNavigation = createStackNavigator(
  {
    Accounts: { screen: AccountsScreen },
    Receive: { screen: ReceiveScreen },
    Send: { screen: SendScreen },
    Wrap: { screen: WrapEtherScreen },
    Unwrap: { screen: UnwrapEtherScreen },
    Orders: { screen: OrdersScreen },
    History: { screen: TransactionHistoryScreen }
  },
  {
    cardStyle: {
      backgroundColor: colors.background
    },
    initialRouteName: 'Accounts',
    headerMode: 'float',
    navigationOptions: ({ navigation }) => ({
      header: () => {
        switch (navigation.state.routeName) {
          case 'History':
          case 'Orders':
          case 'Accounts':
            return <BlankHeader />;

          case 'Receive':
            return (
              <NormalHeader
                navigation={navigation}
                title="Receive Tokens"
                showBackButton={true}
              />
            );

          case 'Send':
            return (
              <NormalHeader
                navigation={navigation}
                title="Send Tokens"
                showBackButton={true}
              />
            );

          case 'Wrap':
            return (
              <NormalHeader
                navigation={navigation}
                title="Wrap Ether"
                showBackButton={true}
              />
            );

          case 'Unwrap':
            return (
              <NormalHeader
                navigation={navigation}
                title="Unwrap Ether"
                showBackButton={true}
              />
            );

          default:
            return (
              <NormalHeader
                navigation={navigation}
                title="Mobidex"
                showBackButton={true}
              />
            );
        }
      }
    })
  }
);

const ProductsNavigation = createStackNavigator(
  {
    List: { screen: ProductScreen },
    Details: { screen: ProductDetailsScreen },
    CreateOrder: { screen: CreateOrderScreen }
  },
  {
    cardStyle: {
      backgroundColor: colors.background
    },
    initialRouteName: 'List',
    headerMode: 'float',
    navigationOptions: ({ navigation }) => ({
      header: () => {
        switch (navigation.state.routeName) {
          case 'List':
            return (
              <ProductsHeader
                navigation={navigation}
                showBackButton={false}
                showForexToggleButton={true}
              />
            );

          case 'Details':
            return (
              <ProductsHeader
                navigation={navigation}
                product={navigation.state.params.product}
                showBackButton={true}
                showForexToggleButton={false}
              />
            );

          default:
            return (
              <NormalHeader
                navigation={navigation}
                title="Mobidex"
                showBackButton={true}
                showForexToggleButton={false}
              />
            );
        }
      }
    })
  }
);

const MainTabsNavigator = createTabNavigator(
  {
    Products: { screen: ProductsNavigation },
    Wallet: { screen: WalletNavigation },
    Settings: { screen: SettingsScreen }
  },
  {
    cardStyle: {
      backgroundColor: colors.background
    },
    tabBarPosition: 'bottom',
    lazy: true,
    initialRouteName: 'Products',
    headerMode: 'float',
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: ({ focused, tintColor }) => {
        switch (navigation.state.routeName) {
          case 'Products':
            return 'Trade';
          default:
            return navigation.state.routeName;
        }
      },
      tabBarIcon: ({ focused, tintColor }) => {
        switch (navigation.state.routeName) {
          case 'Products':
            return (
              <FontAwesome name="line-chart" size={25} color={tintColor} />
            );

          case 'Wallet':
            return <Ionicons name="md-card" size={25} color={tintColor} />;

          case 'Settings':
            return <Ionicons name="ios-settings" size={25} color={tintColor} />;
        }
      }
    })
  }
);

export default createSwitchNavigator(
  {
    Loading: { screen: LoadingScreen },
    Error: { screen: ErrorScreen },
    Onboarding: { screen: OnboardingNavigation },
    Main: { screen: MainTabsNavigator },
    Locked: { screen: LockedNavigation }
  },
  {
    initialRouteName: 'Loading'
  }
);
