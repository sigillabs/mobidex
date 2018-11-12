import moment from 'moment';
import { AsyncStorage } from 'react-native';

export async function cache(ns, update, expiration = 60 * 60 * 24) {
  let lastUpdatedJson = await AsyncStorage.getItem(`${ns}:last-updated`);
  let lastUpdated = lastUpdatedJson ? JSON.parse(lastUpdatedJson).data : null;
  let dataJson = await AsyncStorage.getItem(`${ns}:data`);
  let data = dataJson ? JSON.parse(dataJson).data : null;

  if (
    !data ||
    !lastUpdated ||
    moment().unix() - parseInt(lastUpdated) > expiration
  ) {
    data = await update();

    await AsyncStorage.setItem(`${ns}:data`, JSON.stringify({ data: data }));
    await AsyncStorage.setItem(
      `${ns}:last-updated`,
      JSON.stringify({ data: moment().unix() })
    );
  }

  return data;
}

export async function invalidate(ns) {
  await AsyncStorage.multiRemove([
    AsyncStorage.removeItem(`${ns}:last-updated`),
    AsyncStorage.removeItem(`${ns}:data`)
  ]);
}

export async function clearCache() {
  const keys = await AsyncStorage.getAllKeys();
  const dataKeys = keys.filter(key => key.indexOf(':data') !== -1);
  const lastUpdatedKeys = keys.filter(
    key => key.indexOf(':last-updated') !== -1
  );
  await AsyncStorage.multiRemove(dataKeys.concat(lastUpdatedKeys));
}
