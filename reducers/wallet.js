import * as _ from 'lodash';
import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';

const initialState = {
  web3: null,
  address: null,
  balances: {},
  allowances: {},
  activeTransactions: [],
  transactions: [],
  processing: false
};

export default handleActions(
  {
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
    [Actions.REMOVE_ACTIVE_TRANSACTIONS]: (state, action) => {
      const txs = action.payload;
      const activeTransactions = state.activeTransactions.slice();
      for (const tx of txs) {
        _.remove(activeTransactions, atx => atx.id == tx.id);
      }
      return { ...state, activeTransactions };
    },
    [Actions.SET_ALLOWANCES]: (state, action) => {
      return {
        ...state,
        allowances: { ...state.allowances, ...action.payload }
      };
    },
    [Actions.SET_BALANCES]: (state, action) => {
      return {
        ...state,
        balances: { ...state.balances, ...action.payload }
      };
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
