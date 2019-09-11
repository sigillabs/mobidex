import 'node-libs-react-native/globals';
import { Alert } from 'react-native';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler
} from 'react-native-exception-handler';
import RNRestart from 'react-native-restart';

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
  }, true);
}
