import React, { Component } from "react";
import { Provider } from "react-redux";
import MobidexRouter from "./router";
import { configureStore } from "./store";
import { initialLoad } from "./thunks";

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
    STORE.dispatch(initialLoad());

    this.cleanup.push(STORE.subscribe((state) => {
      this.setState({
        loading: STORE.getState().global.loading
      })
    }))
  }

  render () {
    return (
      <Provider store={STORE}>
        <MobidexRouter loading={this.state.loading} />
      </Provider>
    )
  }
}
