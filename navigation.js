import React from "react";
import { StackNavigator, TabNavigator } from "react-navigation";
import IonIcon from "react-native-vector-icons/Ionicons";
import FAIcon from "react-native-vector-icons/FontAwesome";
import TradingHeader from "./App/headers/Trading";
import WalletHeader from "./App/headers/Wallet";
import SettingsHeader from "./App/headers/Settings";
import TransactionsHeader from "./App/headers/Transactions";
import ReceiveTokensScreen from "./App/screens/ReceiveTokensScreen";
import SendTokensScreen from "./App/screens/SendTokensScreen";
import TokenSettingsScreen from "./App/screens/TokenSettingsScreen";
import TradingScreen from "./App/screens/TradingScreen";
import CreateOrderScreen from "./App/screens/CreateOrderScreen";
import OrderDetailsScreen from "./App/screens/OrderDetailsScreen";
import TransactionHistoryScreen from "./App/screens/TransactionHistoryScreen";

const TransactionsStack = StackNavigator({
  History: { screen: TransactionHistoryScreen }
}, {
  initialRouteName: "History",
  navigationOptions: ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      header: <TransactionsHeader navigation={navigation} />
    };
  }
});

const TradingStack = StackNavigator({
  Trading: { screen: TradingScreen },
  CreateOrder: { screen: CreateOrderScreen },
  OrderDetails: { screen: OrderDetailsScreen }
}, {
  initialRouteName: "CreateOrder",
  navigationOptions: ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      header: <TradingHeader navigation={navigation} />
    };
  }
});

const WalletStack = StackNavigator({
  ReceiveTokens: { screen: ReceiveTokensScreen },
  SendTokens: { screen: SendTokensScreen },
}, {
  initialRouteName: "ReceiveTokens",
  navigationOptions: ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      header: <WalletHeader navigation={navigation} />
    };
  }
});

const SettingsStack = StackNavigator({
  TokenSettings: { screen: TokenSettingsScreen },
}, {
  initialRouteName: "TokenSettings",
  navigationOptions: ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      header: <SettingsHeader navigation={navigation} />
    };
  }
});

export default TabNavigator({
  Settings: { screen: SettingsStack },
  Wallet: { screen: WalletStack },
  Trading: { screen: TradingStack },
  Transactions: { screen: TransactionsStack }
}, {
  initialRouteName: "Trading",
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;

      switch(routeName) {
        case "Settings":
        return <IonIcon name="ios-settings" size={25} color={tintColor} />;
        case "Wallet":
        return <IonIcon name="md-briefcase" size={25} color={tintColor} />;
        case "Trading":
        return <FAIcon name="exchange" size={25} color={tintColor} />
        case "Transactions":
        return <FAIcon name="list" size={25} color={tintColor} />
      }
    },
  })
});