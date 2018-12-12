import { Platform, PermissionsAndroid } from 'react-native';
import { showErrorModal } from './methods';

export async function checkOrRequestExternalStorageRead() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Mobidex Read From Storage',
          message:
            'Mobidex may access to external storage to access your local wallet.'
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      showErrorModal(err);
    }
  } else {
    return true;
  }
}

export async function checkOrRequestExternalStorageWrite() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Mobidex Read From Storage',
          message:
            'Mobidex may access to external storage to access your local wallet.'
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      showErrorModal(err);
    }
  } else {
    return true;
  }
}
