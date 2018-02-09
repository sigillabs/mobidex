import React, { Component } from "react";
import { Text } from "react-native";
import { StackNavigator, TabNavigator } from "react-navigation";
import { Provider } from "react-redux";
import configureStore from "../store";
import LoadingScreen from "./screens/LoadingScreen";
import SettingsScreen from "./screens/SettingsScreen";
import WalletScreen from "./screens/WalletScreen";
import TradingScreen from "./screens/TradingScreen";
import Onboarding from "./Onboarding";
import Startup from "./Startup";
import Splash from "./Splash";

const store = configureStore();

const Navigator = TabNavigator({
  // Loading: {
  //   screen: LoadingScreen,
  // },
  Settings: {
    screen: SettingsScreen,
  },
  // Onboarding: {
  //   screen: OnboardingScreen,
  // },
  Wallet: {
    screen: WalletScreen,
  },
  Trading: {
    screen: TradingScreen,
  },
});

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Startup splashComponent={Splash} navigatorComponent={Navigator} onboardingCompnent={Onboarding} />
      </Provider>
    );
  }
}
