import React, { Component } from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { configureStore } from "../store";
import { load as initialLoad } from "../thunks";

export default class ReduxWrapper extends Component {
  constructor(props) {
    super(props);

    // this.cleanup = [];

    this.state = {
      store: configureStore()
    };
  }

  componentDidMount() {
    this.state.store.dispatch(initialLoad(this.state.store));

    // this.cleanup.push(this.store.subscribe((state) => {
    //   console.warn(this.store.getState().trade.settings);
    // }));
  }

  render () {
    let Component = this.props.component;

    return (
      <Provider store={this.state.store}>
        {this.props.children}
      </Provider>
    )
  }
}
