import {AsyncStorage} from 'react-native';

const KEY = 'app-state';

export async function getState(transform = obj => obj) {
  try {
    const json = await AsyncStorage.getItem(KEY);
    if (!json) {
      return undefined;
    }
    const object = JSON.parse(json);

    return transform(object);
  } catch (err) {
    console.warn(err);
  }
}

export async function clearState() {
  return AsyncStorage.removeItem(KEY);
}

export async function saveState(state) {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}
