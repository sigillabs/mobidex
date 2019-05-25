import { NativeModules } from 'react-native';
import ZeroClientProvider from 'web3-provider-engine/zero';
import { formatHexString } from '../utils/format';

const BitskiManager = NativeModules.BitskiManager;

export class BitskiWallet {
  constructor(settings) {
    this.endpoint = settings.ethereumNodeEndpoint;
    this.exists = false;
    this.available = Boolean(BitskiManager);
    this.settings = settings;
    this.address = null;
  }

  get provider() {
    const addresses = [this.address];
    const engine = ZeroClientProvider({
      stopped: true,
      debug: true,
      rpcUrl: this.endpoint,
      getAccounts: cb => {
        cb(null, addresses);
      },
      signTransaction: (txParams, cb) => {
        console.debug(`signTransaction: ${JSON.stringify(txParams, null, 2)}`);
        BitskiManager.signTransaction(txParams, (err, signedTx) => {
          if (err) {
            cb(err);
          } else {
            cb(null, `0x${signedTx.serialize().toString('hex')}`);
          }
        });
      },
      signMessage: (params, cb) => {
        console.debug('signMessage', params);
        BitskiManager.signMessage(params, (err, signature) => {
          if (err) {
            cb(err);
          } else {
            cb(null, formatHexString(signature));
          }
        });
      }
    });
    engine.on('error', error => {
      console.warn(error);
    });
    engine.start();

    return engine;
  }

  async initialize() {
    const { clientId, redirectUrl } = this.settings.auth;
    await new Promise((resolve, reject) => {
      BitskiManager.initialize(clientId, redirectUrl, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    this.exists = await new Promise((resolve, reject) => {
      BitskiManager.isWalletAvailable((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    if (this.exists) {
      this.address = await this.getWalletAddress();
    }
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

  async getWalletAddress() {
    return await new Promise((resolve, reject) =>
      BitskiManager.loadWalletAddress((err, data) => {
        if (err) return reject(err);
        if (data) {
          resolve(formatHexString(data));
        } else {
          resolve();
        }
      })
    );
  }

  async signTransaction(tx) {}

  async signMessage(message) {}

  async login() {
    return new Promise((resolve, reject) =>
      BitskiManager.login((err, data) => {
        if (err) return reject(err);
        resolve(data);
      })
    );
  }
}
