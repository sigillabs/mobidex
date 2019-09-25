import {NativeModules} from 'react-native';
import ZeroClientProvider from 'web3-provider-engine/zero';
import {chainIDToNetworkName, formatHexString} from '../utils';

const BitskiManager = NativeModules.BitskiManager;

export class BitskiWallet {
  constructor(settings) {
    this.endpoint = settings.ethereumNodeEndpoint;
    this.ready = false;
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
      processTransaction: (txParams, cb) => {
        console.debug(
          `processTransaction: ${JSON.stringify(txParams, null, 2)}`,
        );
        BitskiManager.sendTransaction(txParams, (err, txHash) => {
          console.warn('processTransaction: ', err, txHash);
          if (err) {
            cb(err);
          } else if (!txHash) {
            cb(new Error('Transaction did not go through.'));
          } else {
            cb(null, txHash);
          }
        });
      },
      signMessage: (params, cb) => {
        console.debug('signMessage', params);
        BitskiManager.signMessage(params.data, (err, signature) => {
          console.warn('signMessage: ', err, signature);
          if (err) {
            cb(err);
          } else if (!signature) {
            cb(new Error('Message was not signed.'));
          } else {
            cb(null, signature);
          }
        });
      },
    });
    engine.on('error', error => {
      console.warn(error);
    });
    engine.start();

    return engine;
  }

  async initialize() {
    const {network} = this.settings;
    const {clientId, redirectUrl} = this.settings.auth;
    await new Promise((resolve, reject) => {
      BitskiManager.initialize(
        chainIDToNetworkName(network),
        clientId,
        redirectUrl,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    });
    this.ready = await new Promise((resolve, reject) => {
      BitskiManager.isWalletAvailable((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    if (this.ready) {
      this.address = await this.getWalletAddress();
    }
  }

  async supportsFingerPrintUnlock() {
    return false;
  }

  async supportsFaceIDUnlock() {
    return false;
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
      }),
    );
  }

  async signTransaction(tx) {
    return await new Promise((resolve, reject) =>
      BitskiManager.signTransaction(tx, (err, data) => {
        if (err) return reject(err);
        if (data) {
          resolve(formatHexString(data));
        } else {
          resolve();
        }
      }),
    );
  }

  async signMessage(message) {
    return await new Promise((resolve, reject) =>
      BitskiManager.signMessage(message, (err, data) => {
        if (err) return reject(err);
        if (data) {
          resolve(formatHexString(data));
        } else {
          resolve();
        }
      }),
    );
  }

  async login() {
    return new Promise((resolve, reject) =>
      BitskiManager.login((err, data) => {
        if (err) return reject(err);
        resolve(data);
      }),
    );
  }

  async logout() {
    return await new Promise((resolve, reject) => {
      BitskiManager.logout((err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  }

  async removeWallet() {
    return this.logout();
  }
}
