import React from 'react';
import {
  createStackNavigator,
  createSwitchNavigator,
  createTabNavigator
} from 'react-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../styles';
import ChooseUnlockMethodScreen from './Locked/ChooseUnlockMethodScreen';
import UnlockWithFingerScreen from './Locked/UnlockWithFingerScreen';
import UnlockWithPinScreen from './Locked/UnlockWithPinScreen';
import NormalHeader from './headers/Normal';
import OrdersHeader from './headers/Orders';
import ProductsHeader from './headers/Products';
import SendTokensHeader from './headers/SendTokens';
import ProductDetailsHeader from './headers/ProductDetails';
import ProductScreen from './Main/ProductScreen';
import CreateOrderScreen from './Main/CreateOrderScreen';
import PreviewOrdersScreen from './Main/PreviewOrdersScreen';
import ProductDetailsScreen from './Main/ProductDetailsScreen';
import OrdersScreen from './Orders/OrdersScreen';
import TransactionHistoryScreen from './Orders/TransactionHistoryScreen';
import AccountsScreen from './Wallet/AccountsScreen';
import ReceiveScreen from './Wallet/ReceiveScreen';
import SendScreen from './Wallet/SendScreen';
import WrapEtherScreen from './Wallet/WrapEtherScreen';
import IntroScreen from './Onboarding/IntroScreen';
import ImportMnemonicScreen from './Onboarding/ImportMnemonicScreen';
import PinScreen from './Onboarding/PinScreen';
import PreviewMnemonicScreen from './Onboarding/PreviewMnemonicScreen';
import ErrorScreen from './Error';
import SettingsScreen from './SettingsScreen.js';
import WyreVerificationScreen from './WyreVerificationScreen.js';
import LoadingScreen from './LoadingScreen';
import ActiveTransactionsOverlay from './views/ActiveTransactionsOverlay';
import ActiveOrdersOverlay from './views/ActiveOrdersOverlay';
import * as AnalyticsService from '../services/AnalyticsService';

const LockedNavigation = createSwitchNavigator(
  {
    ChooseUnlockMethod: { screen: ChooseUnlockMethodScreen },
    UnlockWithFinger: { screen: UnlockWithFingerScreen },
    UnlockWithPin: { screen: UnlockWithPinScreen }
  },
  {
    cardStyle: {
      backgroundColor: colors.background
    },
    initialRouteName: 'ChooseUnlockMethod'
  }
);
LockedNavigation.router = AnalyticsService.wrapRouter(LockedNavigation.router);

const OnboardingNavigation = createStackNavigator(
  {
    Intro: { screen: IntroScreen },
    ImportMnemonic: { screen: ImportMnemonicScreen },
    ImportPin: { screen: PinScreen },
    PreviewMnemonic: { screen: PreviewMnemonicScreen }
  },
  {
    cardStyle: {
      backgroundColor: colors.background
    },
    initialRouteName: 'Intro',
    headerMode: 'none'
  }
);
OnboardingNavigation.router = AnalyticsService.wrapRouter(
  OnboardingNavigation.router
);

const OrdersNavigation = createStackNavigator(
  {
    Orders: { screen: OrdersScreen },
    History: { screen: TransactionHistoryScreen }
  },
  {
    cardStyle: {
      backgroundColor: colors.background
    },
    initialRouteName: 'Orders',
    lazy: true,
    headerMode: 'float',
    navigationOptions: ({ navigation }) => ({
      header: () => {
        if (navigation.getParam('hideHeader')) {
          return null;
        }

        switch (navigation.state.routeName) {
          case 'Orders':
            return (
              <OrdersHeader
                navigation={navigation}
                title="Active Orders"
                showBackButton={false}
              />
            );

          case 'History':
          default:
            return (
              <NormalHeader
                navigation={navigation}
                title="Transaction History"
                showBackButton={true}
              />
            );
        }
      }
    })
  }
);
OrdersNavigation.router = AnalyticsService.wrapRouter(OrdersNavigation.router);

const WalletNavigation = createStackNavigator(
  {
    Accounts: { screen: AccountsScreen },
    Receive: { screen: ReceiveScreen },
    Send: { screen: SendScreen },
    Wrap: { screen: WrapEtherScreen }
  },
  {
    cardStyle: {
      backgroundColor: colors.background
    },
    initialRouteName: 'Accounts',
    lazy: true,
    headerMode: 'float',
    navigationOptions: ({ navigation }) => ({
      header: () => {
        if (navigation.getParam('hideHeader')) {
          return null;
        }

        switch (navigation.state.routeName) {
          case 'Accounts':
            return null;

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
              <SendTokensHeader
                navigation={navigation}
                asset={navigation.state.params.asset}
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
WalletNavigation.router = AnalyticsService.wrapRouter(WalletNavigation.router);

const SettingsNavigation = createStackNavigator(
  {
    About: { screen: SettingsScreen },
    WyreVerification: { screen: WyreVerificationScreen }
  },
  {
    cardStyle: {
      backgroundColor: colors.background
    },
    initialRouteName: 'About',
    lazy: true,
    headerMode: 'float',
    navigationOptions: ({ navigation }) => ({
      header: () => {
        if (navigation.getParam('hideHeader')) {
          return null;
        }

        switch (navigation.state.routeName) {
          case 'WyreVerification':
            return null;

          case 'About':
            return (
              <NormalHeader
                navigation={navigation}
                title="Receive Tokens"
                showBackButton={true}
              />
            );
        }
      }
    })
  }
);
WalletNavigation.router = AnalyticsService.wrapRouter(WalletNavigation.router);

const ProductsNavigation = createStackNavigator(
  {
    List: { screen: ProductScreen },
    Details: { screen: ProductDetailsScreen },
    CreateOrder: { screen: CreateOrderScreen },
    PreviewOrders: { screen: PreviewOrdersScreen }
  },
  {
    cardStyle: {
      backgroundColor: colors.background
    },
    lazy: true,
    initialRouteName: 'List',
    headerMode: 'float',
    navigationOptions: ({ navigation }) => ({
      header: () => {
        if (navigation.getParam('hideHeader')) {
          return null;
        }

        switch (navigation.state.routeName) {
          case 'List':
            return (
              <ProductsHeader
                navigation={navigation}
                showBackButton={false}
                showForexToggleButton={true}
              />
            );

          case 'PreviewOrders':
          case 'CreateOrder':
          case 'Details':
            return (
              <ProductDetailsHeader
                navigation={navigation}
                base={navigation.state.params.product.base}
                quote={navigation.state.params.product.quote}
                showBackButton={true}
                showForexToggleButton={true}
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
ProductsNavigation.router = AnalyticsService.wrapRouter(
  ProductsNavigation.router
);

const MainTabsNavigator = createTabNavigator(
  {
    Products: { screen: ProductsNavigation },
    Orders: { screen: OrdersNavigation },
    Wallet: { screen: WalletNavigation },
    Settings: { screen: SettingsNavigation }
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
          case 'Settings':
            return 'About';
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

          case 'Orders':
            return (
              <ActiveTransactionsOverlay orientation="right">
                <ActiveOrdersOverlay>
                  <Ionicons name="ios-book" size={25} color={tintColor} />
                </ActiveOrdersOverlay>
              </ActiveTransactionsOverlay>
            );

          case 'Settings':
            return <Ionicons name="ios-settings" size={25} color={tintColor} />;
        }
      }
    })
  }
);
MainTabsNavigator.router = AnalyticsService.wrapRouter(
  MainTabsNavigator.router
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
    cardStyle: {
      backgroundColor: colors.background
    },
    initialRouteName: 'Loading'
  }
);
