import * as _ from 'lodash';
import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';

const initialState = {
  web3: null,
  address: null,
  assets: [],
  activeTransactions: [],
  activeServerTransactions: [],
  transactions: [],
  processing: false
};

export default handleActions(
  {
    [Actions.ADD_ASSETS]: (state, action) => {
      let assets = _.unionBy(action.payload, state.assets, 'address');
      return { ...state, assets };
    },
    [Actions.PROCESSING]: state => {
      return { ...state, processing: true };
    },
    [Actions.NOT_PROCESSING]: state => {
      return { ...state, processing: false };
    },
    [Actions.ADD_TRANSACTIONS]: (state, action) => {
      const transactions = _.unionBy(action.payload, state.transactions, 'id');
      const activeTransactions = state.activeTransactions.slice();
      for (const tx of transactions) {
        _.remove(activeTransactions, atx => {
          atx.id === tx.id;
        });
      }
      return { ...state, activeTransactions, transactions };
    },
    [Actions.ADD_ACTIVE_TRANSACTIONS]: (state, action) => {
      const activeTransactions = _.unionBy(
        action.payload,
        state.activeTransactions,
        'id'
      );
      for (const tx of state.transactions) {
        _.remove(activeTransactions, atx => {
          atx.id === tx.id;
        });
      }
      return { ...state, activeTransactions };
    },
    [Actions.ADD_ACTIVE_SERVER_TRANSACTIONS]: (state, action) => {
      const activeServerTransactions = _.unionBy(
        action.payload,
        state.activeServerTransactions,
        'data'
      );
      for (const tx of state.transactions) {
        _.remove(activeServerTransactions, atx => {
          atx.data === tx.data;
        });
      }
      return { ...state, activeServerTransactions };
    },
    [Actions.REMOVE_ACTIVE_TRANSACTIONS]: (state, action) => {
      const txs = action.payload;
      const activeTransactions = state.activeTransactions.slice();
      for (const tx of txs) {
        _.remove(activeTransactions, atx => atx.id == tx.id);
      }
      return { ...state, activeTransactions };
    },
    [Actions.REMOVE_ACTIVE_SERVER_TRANSACTIONS]: (state, action) => {
      const txs = action.payload;
      const activeServerTransactions = state.activeServerTransactions.slice();
      for (const tx of txs) {
        _.remove(activeServerTransactions, atx => atx.data == tx.data);
      }
      return { ...state, activeServerTransactions };
    },
    [Actions.SET_WALLET]: (state, action) => {
      let { address, web3 } = action.payload;
      if (address && web3) {
        return { ...state, address, web3 };
      } else {
        return { ...state, address: null, web3: null };
      }
    }
  },
  initialState
);
