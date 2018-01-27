import * as _ from "lodash";
import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Provider } from "react-redux";
import { createStore } from "redux";
import MobidexRouter from "./router";
import { configureStore } from "./store";
import { loadOrders, loadKeyPair } from "./thunks";
import { Loader } from "./views";

const STORE = configureStore();

export default class Mobidex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };

    this.cleanup = [];
  }

  componentDidMount() {
    STORE.dispatch(loadOrders());
    STORE.dispatch(loadKeyPair());

    this.cleanup.push(STORE.subscribe((state) => {
      this.setState({
        loading: STORE.getState().global.loading
      })
    }))
  }

  render () {
    return (
      <Provider store={STORE}>
        {this.state.loading ? <Loader /> : <MobidexRouter />}
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF"
  }
})
