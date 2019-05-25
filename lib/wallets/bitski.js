import { NativeModules } from 'react-native';

const BitskiManager = NativeModules.BitskiManager;

export class BitskiWallet {
  constructor(settings) {
    this.exists = false;
  }

  get provider() {
    return null;
  }

  async initialize() {
    this.exists = await new Promise(resolve =>
      BitskiManager.initialized(logged_in => resolve(logged_in))
    );
  }

  async supportsFingerPrintUnlock() {
    return false;
  }

  async supportsFaceIDUnlock() {
    return false;
  }

  async supportsOffsiteUnlock() {
    return true;
  }

  async signTransaction(tx) {}

  async signMessage(message) {}

  async loginIn() {}
}
