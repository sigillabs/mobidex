import EthTx from 'ethereumjs-tx';
import {NativeModules} from 'react-native';
import ZeroClientProvider from 'web3-provider-engine/zero';
import {showModal} from '../../navigation';
import {formatHexString} from '../utils';

const WalletManager = NativeModules.WalletManager;

function errorify(error) {
  if (typeof error === 'string') {
    return new Error(error);
  } else {
    return error;
  }
}

export class IntegratedWallet {
  constructor(settings) {
    this.endpoint = settings.ethereumNodeEndpoint;
    this.address = settings.address;
    this.ready = false;
    this.available = Boolean(WalletManager);
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
        showModal('modals.UnlockAndSign', {
          tx: txParams,
          next: (err, signature) => {
            if (err) {
              return cb(err);
            }

            if (signature === null || signature === undefined) {
              return cb(new Error('Could not unlock wallet'));
            }

            const signedTx = new EthTx({...txParams, ...signature});
            return cb(null, `0x${signedTx.serialize().toString('hex')}`);
          },
        });
      },
      signMessage: (params, cb) => {
        console.debug('signMessage', params);
        showModal('modals.UnlockAndSign', {
          message: params.data,
          next: (err, signature) => {
            if (err) {
              return cb(err);
            }

            if (signature === null || signature === undefined) {
              return cb(new Error('Could not unlock wallet'));
            }

            return cb(null, formatHexString(signature));
          },
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
    this.address = await this.getWalletAddress();
    this.ready = Boolean(this.address);
  }

  async supportsFingerPrintUnlock() {
    return await new Promise((resolve, reject) =>
      WalletManager.supportsFingerPrintAuthentication((err, data) => {
        if (err) return reject(errorify(err));
        resolve(data);
      }),
    );
  }

  async supportsFaceIDUnlock() {
    return await new Promise((resolve, reject) =>
      WalletManager.supportsFaceIDAuthentication((err, data) => {
        if (err) return reject(errorify(err));
        resolve(data);
      }),
    );
  }

  async cancelFingerPrintUnlock() {
    return await new Promise((resolve, reject) =>
      WalletManager.cancelFingerPrintAuthentication((err, data) => {
        if (err) return reject(errorify(err));
        resolve(data);
      }),
    );
  }

  async getPrivateKey(password) {
    return await new Promise((resolve, reject) =>
      WalletManager.loadWallet(password, (err, data) => {
        if (err) return reject(errorify(err));
        resolve(data);
      }),
    );
  }

  async getWalletAddress() {
    return await new Promise((resolve, reject) =>
      WalletManager.loadWalletAddress((err, data) => {
        if (err) return reject(errorify(err));
        if (data) {
          resolve(formatHexString(data));
        } else {
          resolve();
        }
      }),
    );
  }

  async signTransaction(tx, password) {
    return await new Promise((resolve, reject) =>
      WalletManager.signTransaction(tx, password, (err, data) => {
        if (err) return reject(new Error('Could not sign transaction'));
        if (!data) return resolve();
        resolve({
          r: formatHexString(data.r),
          s: formatHexString(data.s),
          v: formatHexString(data.v),
        });
      }),
    );
  }

  async signMessage(message, password) {
    return await new Promise((resolve, reject) =>
      WalletManager.signMessage(message, password, (err, data) => {
        if (err) return reject(new Error('Could not sign message'));
        resolve(formatHexString(data));
      }),
    );
  }

  async importMnemonics(mnemonics, password) {
    await new Promise((resolve, reject) => {
      WalletManager.importWalletByMnemonics(
        mnemonics,
        password,
        (err, data) => {
          if (err) return reject(errorify(err));
          resolve(data);
        },
      );
    });
  }

  async generateMnemonics() {
    return await new Promise((resolve, reject) => {
      WalletManager.generateMnemonics((err, data) => {
        if (err) return reject(errorify(err));
        resolve(data);
      });
    });
  }

  async removeWallet() {
    return await new Promise((resolve, reject) => {
      WalletManager.removeWallet((err, data) => {
        if (err) return reject(errorify(err));
        resolve(data);
      });
    });
  }
}
