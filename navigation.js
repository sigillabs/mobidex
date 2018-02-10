import React from "react";
import { StackNavigator, TabNavigator } from "react-navigation";
import IonIcon from "react-native-vector-icons/Ionicons";
import FAIcon from "react-native-vector-icons/FontAwesome";
import SettingsScreen from "./App/screens/SettingsScreen";
import WalletScreen from "./App/screens/WalletScreen";
import TradingScreen from "./App/screens/TradingScreen";
import CreateOrderScreen from "./App/screens/CreateOrderScreen";
import OrderDetailsScreen from "./App/screens/OrderDetailsScreen";
import TradingHeader from "./App/headers/Trading";

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

export default TabNavigator({
  Settings: { screen: SettingsScreen },
  Wallet: { screen: WalletScreen },
  Trading: { screen: TradingStack }
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
      }
    },
  })
});
