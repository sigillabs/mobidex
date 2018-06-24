import { AsyncStorage } from 'react-native';

const V0_PATH = 'lock';

export async function hasWalletOnFileSystem() {
  return !!await AsyncStorage.getItem(V0_PATH);
}

export async function getWalletFromFileSystem() {
  return await AsyncStorage.getItem(V0_PATH);
}

export async function storeWalletOnFileSystem(json) {
  return await AsyncStorage.setItem(V0_PATH, json);
}
