import { Navigation } from "react-native-navigation";
import StartupScreen from "./App/screens/StartupScreen";
import LoadingScreen from "./App/screens/LoadingScreen";
import SettingsScreen from "./App/screens/SettingsScreen";
import OnboardingScreen from "./App/screens/OnboardingScreen";
import WalletScreen from "./App/screens/WalletScreen";
import TradingScreen from "./App/screens/TradingScreen";

export default function registerScreens(store, Provider) {
  Navigation.registerComponent("mobidex.StartupScreen", () => StartupScreen, store, Provider);
  Navigation.registerComponent("mobidex.LoadingScreen", () => LoadingScreen, store, Provider);
  Navigation.registerComponent("mobidex.SettingsScreen", () => SettingsScreen, store, Provider);
  Navigation.registerComponent("mobidex.OnboardingScreen", () => OnboardingScreen, store, Provider);
  Navigation.registerComponent("mobidex.WalletScreen", () => WalletScreen, store, Provider);
  Navigation.registerComponent("mobidex.TradingScreen", () => TradingScreen, store, Provider);
}
