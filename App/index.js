import React, { Component } from "react";
import { View } from "react-native";
import { Provider, connect } from "react-redux";
import MobidexRouter from "./router";
import { configureStore } from "./store";
import { load as initialLoad } from "./thunks";

const STORE = configureStore();

export default class Mobidex extends Component {
  constructor(props) {
    super(props);

    this.cleanup = [];
  }

  componentDidMount() {
    STORE.dispatch(initialLoad(STORE));

    // this.cleanup.push(STORE.subscribe((state) => {
    //   console.warn(STORE.getState().trade.orders);
    // }));
  }

  render () {
    return (
      <Provider store={STORE}>
        <MobidexRouter />
      </Provider>
    )
  }
}
