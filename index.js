import "node-libs-react-native/globals";
import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";
import registerScreens from "./screens";
import configureStore from "./store";
import registerScreensUpdater from "./screen-updater";

registerScreens(configureStore(), Provider);

Navigation.startSingleScreenApp({
  screen: {
    screen: "mobidex.StartupScreen"
  },
  passProps: {
    finish: () => {
      Navigation.startTabBasedApp({
        tabs: [
          {
            label: "Trade",
            screen: "mobidex.TradingScreen",
            title: "Trade"
          },
          {
            label: "Wallet",
            screen: "mobidex.WalletScreen",
            title: "Wallet"
          },
          {
            label: "Settings",
            screen: "mobidex.SettingsScreen",
            title: "Settings"
          }
        ]
      });
    }
  }
});