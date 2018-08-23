import * as _ from 'lodash';
import { InteractionManager } from 'react-native';
import {
  addActiveTransactions,
  removeActiveServerTransactions
} from '../../actions';
import {
  updateActiveServerTransactionCache,
  updateActiveTransactionCache
} from '../../thunks';
import { getActiveServerTransactions } from '../../utils';

const TIMEOUT = 5 * 1000;

let _store;
let timer = null;

export function setStore(store) {
  _store = store;
}

export function start() {
  if (timer === null) {
    run();
  }
}

export function stop() {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
}

async function run() {
  InteractionManager.runAfterInteractions(async () => {
    try {
      const {
        wallet: { activeServerTransactions, web3 }
      } = _store.getState();

      const responseLookup = {};

      if (web3) {
        for (const activeServerTransaction of activeServerTransactions) {
          if (!activeServerTransaction.id) {
            continue;
          }

          try {
            if (!(activeServerTransaction.id in responseLookup)) {
              responseLookup[
                activeServerTransaction.id
              ] = await getActiveServerTransactions(activeServerTransaction.id);
            }

            if (!responseLookup[activeServerTransaction.id]) {
              _store.dispatch(
                removeActiveServerTransactions([activeServerTransaction])
              );
              _store.dispatch(updateActiveServerTransactionCache());
              continue;
            }

            const response = responseLookup[activeServerTransaction.id];
            const index = _.indexOf(
              response.signedData,
              activeServerTransaction.data
            );

            if (index === -1) {
              _store.dispatch(
                removeActiveServerTransactions([activeServerTransaction])
              );
              _store.dispatch(updateActiveServerTransactionCache());
              continue;
            }

            if (!response.transactionHashes) {
              // Weird edge case
              console.warn(response);
              continue;
            }

            const txhash = response.transactionHashes[index];

            if (txhash) {
              _store.dispatch(
                removeActiveServerTransactions([activeServerTransaction])
              );
              _store.dispatch(updateActiveServerTransactionCache());
              _store.dispatch(
                addActiveTransactions([
                  { ...activeServerTransaction, id: txhash }
                ])
              );
              _store.dispatch(updateActiveTransactionCache());
            }
          } catch (err) {
            console.warn(err.message);
            _store.dispatch(
              removeActiveServerTransactions([activeServerTransaction])
            );
            _store.dispatch(updateActiveServerTransactionCache());
          }
        }
      }
    } catch (err) {
      console.warn(err.message);
    }

    timer = setTimeout(run, TIMEOUT);
  });
}
