import 'node-libs-react-native/globals';
import { EventEmitter } from 'events';
import { AppRegistry, YellowBox } from 'react-native';
import App from './App';

YellowBox.ignoreWarnings(['Class RCTCxxModule', 'Warning:', 'Method']);
EventEmitter.defaultMaxListeners = 1000;

AppRegistry.registerComponent('mobidex', () => App);
