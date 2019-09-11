import {addActiveTransactions, removeActiveTransactions} from '../actions';
import {cache} from '../lib/utils';
import BaseService from './BaseService';
import {WalletService} from './WalletService';

export class TransactionService extends BaseService {
  async addActiveTransaction(tx) {
    this.store.dispatch(addActiveTransactions([tx]));

    const {
      settings,
      wallet: {activeTransactions},
    } = this.store.getState();
    await cache(
      `transactions:${settings.network}:active`,
      async () => {
        return activeTransactions;
      },
      0,
    );
  }

  async removeActiveTransaction(tx) {
    this.store.dispatch(removeActiveTransactions([tx]));

    const {
      settings,
      wallet: {activeTransactions},
    } = this.store.getState();
    await cache(
      `transactions:${settings.network}:active`,
      async () => {
        return activeTransactions;
      },
      0,
    );
  }

  async getActiveTransactions() {
    const {settings} = this.store.getState();
    return await cache(
      `transactions:${settings.network}:active`,
      async () => {
        return [];
      },
      60 * 60 * 24 * 7,
    );
  }
}
