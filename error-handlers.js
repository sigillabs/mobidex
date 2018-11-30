import 'node-libs-react-native/globals';
import { Alert } from 'react-native';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler
} from 'react-native-exception-handler';
import RNRestart from 'react-native-restart';
import * as AnalyticsService from './services/AnalyticsService';

export function setExceptionHandlers() {
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
