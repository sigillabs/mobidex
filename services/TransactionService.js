import { addActiveTransactions, removeActiveTransactions } from '../actions';
import { cache } from '../utils';
import BaseService from './BaseService';
import BaseWatchdog from './BaseWatchdog';
import * as WalletService from './WalletService';

export class ActiveTransactionWatchdog extends BaseWatchdog {
  constructor(store, timeout = 1) {
    super(timeout);

    this.store = store;
  }

  async exec() {
    const {
      wallet: { activeTransactions }
    } = this.store.getState();

    const web3 = WalletService.getWeb3();

    if (web3) {
      const txhashes = activeTransactions.map(({ id }) => id);

      for (const txhash of txhashes) {
        try {
          const receipt = await new Promise((resolve, reject) => {
            web3.eth.getTransactionReceipt(txhash, (err, receipt) => {
              if (err) {
                reject(err);
              } else {
                resolve(receipt);
              }
            });
          });
          if (receipt) {
            TransactionService.instance.removeActiveTransaction({ id: txhash });
          }
        } catch (err) {
          console.warn(err.message);
          TransactionService.instance.removeActiveTransaction({ id: txhash });
        }
      }
    }
  }
}

export class TransactionService extends BaseService {
  async addActiveTransaction(tx) {
    this.store.dispatch(addActiveTransactions([tx]));

    const {
      settings,
      wallet: { activeTransactions }
    } = this.store.getState();
    await cache(
      `transactions:${settings.network}:active`,
      async () => {
        return activeTransactions;
      },
      0
    );
  }

  async removeActiveTransaction(tx) {
    this.store.dispatch(removeActiveTransactions([tx]));

    const {
      settings,
      wallet: { activeTransactions }
    } = this.store.getState();
    await cache(
      `transactions:${settings.network}:active`,
      async () => {
        return activeTransactions;
      },
      0
    );
  }

  async getActiveTransactions() {
    const { settings } = this.store.getState();
    return await cache(
      `transactions:${settings.network}:active`,
      async () => {
        return [];
      },
      60 * 60 * 24 * 7
    );
  }
}
