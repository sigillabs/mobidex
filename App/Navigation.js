import React from 'react';
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator
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
import InitialLoadScreen from './Main/InitialLoadScreen';
import ProductScreen from './Main/ProductScreen';
import CreateOrderScreen from './Main/CreateOrderScreen';
import PreviewOrdersScreen from './Main/PreviewOrdersScreen';
import ProductDetailsScreen from './Main/ProductDetailsScreen';
import OrdersScreen from './Orders/OrdersScreen';
import TransactionHistoryScreen from './Orders/TransactionHistoryScreen';
import AccountsScreen from './Wallet/AccountsScreen';
import ToggleApproveScreen from './Wallet/ToggleApproveScreen';
import ReceiveScreen from './Wallet/ReceiveScreen';
import SendScreen from './Wallet/SendScreen';
import WrapEtherScreen from './Wallet/WrapEtherScreen';
import IntroScreen from './Onboarding/IntroScreen';
import ImportMnemonicScreen from './Onboarding/ImportMnemonicScreen';
import PreviewMnemonicScreen from './Onboarding/PreviewMnemonicScreen';
import PinScreen from './Onboarding/PinScreen';
import ConstructWalletScreen from './Onboarding/ConstructWalletScreen';
import ErrorScreen from './Error';
import SettingsScreen from './SettingsScreen.js';
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
    PreviewMnemonic: { screen: PreviewMnemonicScreen },
    ConstructWallet: { screen: ConstructWalletScreen }
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
    Orders: {
      screen: OrdersScreen,
      navigationOptions: ({ navigation }) => ({
        header: navigation.getParam('hideHeader') ? null : (
          <OrdersHeader
            navigation={navigation}
            title="Active Orders"
            showBackButton={false}
          />
        )
      })
    },
    History: {
      screen: TransactionHistoryScreen,
      navigationOptions: ({ navigation }) => ({
        header: navigation.getParam('hideHeader') ? null : (
          <NormalHeader
            navigation={navigation}
            title="Transaction History"
            showBackButton={true}
          />
        )
      })
    }
  },
  {
    cardStyle: {
      backgroundColor: colors.background
    },
    initialRouteName: 'Orders',
    lazy: true,
    headerMode: 'float'
  }
);
OrdersNavigation.router = AnalyticsService.wrapRouter(OrdersNavigation.router);

const WalletNavigation = createStackNavigator(
  {
    Accounts: {
      screen: AccountsScreen,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    Receive: {
      screen: ReceiveScreen,
      navigationOptions: ({ navigation }) => ({
        header: navigation.getParam('hideHeader') ? null : (
          <NormalHeader
            navigation={navigation}
            title="Receive Tokens"
            showBackButton={true}
          />
        )
      })
    },
    Send: {
      screen: SendScreen,
      navigationOptions: ({ navigation }) => ({
        header: navigation.getParam('hideHeader') ? null : (
          <SendTokensHeader
            navigation={navigation}
            asset={navigation.state.params.asset}
          />
        )
      })
    },
    Wrap: {
      screen: WrapEtherScreen,
      navigationOptions: ({ navigation }) => ({
        header: navigation.getParam('hideHeader') ? null : (
          <NormalHeader
            navigation={navigation}
            title="Wrap Ether"
            showBackButton={true}
          />
        )
      })
    },
    ToggleApprove: {
      screen: ToggleApproveScreen,
      navigationOptions: ({ navigation }) => ({
        header: navigation.getParam('hideHeader') ? null : (
          <NormalHeader
            navigation={navigation}
            title="Mobidex"
            showBackButton={true}
          />
        )
      })
    }
  },
  {
    cardStyle: {
      backgroundColor: colors.background
    },
    initialRouteName: 'Accounts',
    lazy: true,
    headerMode: 'float'
  }
);
WalletNavigation.router = AnalyticsService.wrapRouter(WalletNavigation.router);

const ProductsNavigation = createStackNavigator(
  {
    List: {
      screen: ProductScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <ProductsHeader
            navigation={navigation}
            showBackButton={false}
            showForexToggleButton={true}
          />
        )
      })
    },
    Details: {
      screen: ProductDetailsScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <ProductDetailsHeader
            navigation={navigation}
            base={navigation.state.params.product.base}
            quote={navigation.state.params.product.quote}
            showBackButton={true}
            showForexToggleButton={true}
          />
        )
      })
    },
    CreateOrder: {
      screen: CreateOrderScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <ProductDetailsHeader
            navigation={navigation}
            base={navigation.state.params.product.base}
            quote={navigation.state.params.product.quote}
            showBackButton={true}
            showForexToggleButton={true}
          />
        )
      })
    },
    PreviewOrders: {
      screen: PreviewOrdersScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <ProductDetailsHeader
            navigation={navigation}
            base={navigation.state.params.product.base}
            quote={navigation.state.params.product.quote}
            showBackButton={true}
            showForexToggleButton={true}
          />
        )
      })
    }
  },
  {
    cardStyle: {
      backgroundColor: colors.background
    },
    initialRouteName: 'List',
    headerMode: 'float'
  }
);
ProductsNavigation.router = AnalyticsService.wrapRouter(
  ProductsNavigation.router
);

const MainTabsNavigator = createBottomTabNavigator(
  {
    Products: {
      screen: ProductsNavigation,
      /* eslint-disable */
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: 'Trade',
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="line-chart" size={25} color={tintColor} />
        )
      })
      /* eslint-enable */
    },
    Orders: {
      screen: OrdersNavigation,
      /* eslint-disable */
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: 'Orders',
        tabBarIcon: ({ tintColor }) => (
          <ActiveTransactionsOverlay orientation="right">
            <ActiveOrdersOverlay>
              <Ionicons name="ios-book" size={25} color={tintColor} />
            </ActiveOrdersOverlay>
          </ActiveTransactionsOverlay>
        )
      })
      /* eslint-enable */
    },
    Wallet: {
      screen: WalletNavigation,
      /* eslint-disable */
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: 'Wallet',
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="md-card" size={25} color={tintColor} />
        )
      })
      /* eslint-enable */
    },
    Settings: {
      screen: SettingsScreen,
      /* eslint-disable */
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: 'About',
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-settings" size={25} color={tintColor} />
        )
      })
      /* eslint-enable */
    }
  },
  {
    cardStyle: {
      backgroundColor: colors.background
    },
    initialRouteName: 'Products'
  }
);
MainTabsNavigator.router = AnalyticsService.wrapRouter(
  MainTabsNavigator.router
);

export default createSwitchNavigator(
  {
    Initial: { screen: InitialLoadScreen },
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
