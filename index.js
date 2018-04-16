import 'node-libs-react-native/globals';
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import App from './App';

console.disableYellowBox = true;

AppRegistry.registerComponent('mobidex', () => App);
