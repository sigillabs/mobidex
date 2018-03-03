import React, { Component } from "react";
import { StackNavigator, TabNavigator } from "react-navigation";
import { Provider } from "react-redux";
import configureStore from "../store";
import Startup from "./Startup";

const store = configureStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Startup />
      </Provider>
    );
  }
}
