import { InteractionManager } from 'react-native';
import { removeActiveTransactions } from '../../actions';
import { updateActiveTransactionCache } from '../../thunks';

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
        wallet: { activeTransactions, web3 }
      } = _store.getState();

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
              _store.dispatch(removeActiveTransactions([{ id: txhash }]));
              _store.dispatch(updateActiveTransactionCache());
            }
          } catch (err) {
            console.warn(err.message);
            _store.dispatch(removeActiveTransactions([{ id: txhash }]));
            _store.dispatch(updateActiveTransactionCache());
          }
        }
      }
    } catch (err) {
      console.warn(err.message);
    }

    timer = setTimeout(run, TIMEOUT);
  });
}
