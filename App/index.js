import React, { Component } from "react";
import { StackNavigator, TabNavigator } from "react-navigation";
import { Provider } from "react-redux";
import configureStore from "../store";
import Main from "./Main";
import Onboarding from "./Onboarding";
import Startup from "./Startup";
import Splash from "./Splash";

const store = configureStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Startup splashComponent={Splash} mainComponent={Main} onboardingCompnent={Onboarding} />
      </Provider>
    );
  }
}
