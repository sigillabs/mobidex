import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '../store';
import Bootstrap from './Bootstrap';

const store = configureStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Bootstrap />
      </Provider>
    );
  }
}
