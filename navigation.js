import React from "react";
import { StackNavigator, TabNavigator } from "react-navigation";
import IonIcon from "react-native-vector-icons/Ionicons";
import FAIcon from "react-native-vector-icons/FontAwesome";
import TradingHeader from "./App/headers/Trading";
import WalletHeader from "./App/headers/Wallet";
import SettingsHeader from "./App/headers/Settings";
import TransactionsHeader from "./App/headers/Transactions";
import MyOrdersScreen from "./App/screens/MyOrdersScreen";
import PortfolioScreen from "./App/screens/PortfolioScreen";
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
  OrderDetails: { screen: OrderDetailsScreen },
  MyOrders: { screen: MyOrdersScreen }
}, {
  initialRouteName: "Trading",
  navigationOptions: ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      header: <TradingHeader navigation={navigation} />
    };
  }
});

const WalletStack = StackNavigator({
  Portfolio: { screen: PortfolioScreen },
}, {
  initialRouteName: "Portfolio",
  navigationOptions: ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      header: <WalletHeader navigation={navigation} />
    };
  }
});

export default TabNavigator({
  Wallet: { screen: WalletStack },
  Trading: { screen: TradingStack },
  Transactions: { screen: TransactionsStack }
}, {
  initialRouteName: "Wallet",
  swipeEnabled: true,
  lazy: true,
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;

      switch(routeName) {
        case "Wallet":
        return <IonIcon name="md-briefcase" size={25} color={tintColor} />;
        case "Trading":
        return <FAIcon name="exchange" size={25} color={tintColor} />;
        case "Transactions":
        return <FAIcon name="list" size={25} color={tintColor} />;
      }
    },
  })
});
