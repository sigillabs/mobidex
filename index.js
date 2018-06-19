import 'node-libs-react-native/globals';
import { EventEmitter } from 'events';
import React, { Component } from 'react';
import { AppRegistry, YellowBox } from 'react-native';
import App from './App';

// console.disableYellowBox = true;
YellowBox.ignoreWarnings(['Class RCTCxxModule']);
EventEmitter.defaultMaxListeners = 1000;

AppRegistry.registerComponent('mobidex', () => App);
