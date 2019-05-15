import { AsyncStorage } from 'react-native';

const KEY = 'bitski-credentials';

export async function getState() {
  const json = await AsyncStorage.getItem(KEY);
  if (!json) {
    return undefined;
  }
  const object = JSON.parse(json);

  return {
    accessToken: null,
    accessTokenExpirationDate: null,
    refreshToken: null,
    ...object
  };
}

export async function clearState() {
  return AsyncStorage.removeItem(KEY);
}

export async function saveState(state) {
  await AsyncStorage.setItem(
    KEY,
    JSON.stringify({
      accessToken: null,
      accessTokenExpirationDate: null,
      refreshToken: null,
      ...state
    })
  );
}
