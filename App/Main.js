import PropTypes from "prop-types";
import React, { Component } from "react";
import { View } from "react-native";
import { Header } from "react-native-elements";
import { StackNavigator, TabNavigator } from "react-navigation";
import { connect } from "react-redux";
import IonIcon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import LoadingScreen from "./screens/LoadingScreen";
import SettingsScreen from "./screens/SettingsScreen";
import WalletScreen from "./screens/WalletScreen";
import TradingScreen from "./screens/TradingScreen";

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
  Wallet: { screen: WalletScreen },
  Trading: { screen: TradingScreen},
}, {
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

class Main extends Component {
  render() {
    return (
      <View style={[{ width: this.props.width, height: this.props.height }]}>
        <Header
          leftComponent={{ icon: "menu", color: "#fff" }}
          centerComponent={{ text: "Mobidex", style: { color: "white" } }}
          rightComponent={{ icon: "home", color: "#fff" }}
        />
        <Navigator />
      </View>
    );
  }
}

export default connect((state) => ({ ...state.device.layout }), dispatch => ({ dispatch }))(Main);
