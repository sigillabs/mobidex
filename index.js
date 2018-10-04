import 'node-libs-react-native/globals';
import { EventEmitter } from 'events';
import { Alert, AppRegistry, I18nManager, YellowBox } from 'react-native';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler
} from 'react-native-exception-handler';
import RNRestart from 'react-native-restart';
import App from './App';
import * as AnalyticsService from './services/AnalyticsService';

try {
  I18nManager.allowRTL(false);
} catch (e) {
  console.log(e);
}

YellowBox.ignoreWarnings([
  'Class RCTCxxModule',
  'Warning:',
  'Method',
  'Module',
  'MOBIDEX:'
]);
EventEmitter.defaultMaxListeners = 32000;

AppRegistry.registerComponent('mobidex', () => App);

if (!__DEV__) {
  setJSExceptionHandler((error, isFatal) => {
    if (isFatal) {
      if (error) {
        Alert.alert(
          'Unexpected error occurred',
          `Error: ${error.name} ${
            error.message
          }. We will need to restart the app.`,
          [
            {
              text: 'Restart',
              onPress: () => RNRestart.Restart()
            }
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          'Unexpected error occurred',
          'We will need to restart the app.',
          [
            {
              text: 'Restart',
              onPress: () => RNRestart.Restart()
            }
          ],
          { cancelable: false }
        );
      }
    }

    if (error) {
      AnalyticsService.trackEvent(isFatal ? 'crash' : 'error', 'report', {
        error: `${error.name} ${error.message}`
      });
    } else {
      AnalyticsService.trackEvent(isFatal ? 'crash' : 'error', 'report', {
        error: 'Unknown error'
      });
    }
  }, true);

  setNativeExceptionHandler(exceptionString => {
    AnalyticsService.trackEvent('crash', 'report', 'FATAL: ' + exceptionString);
  });
}
