import {handleActions} from 'redux-actions';
import * as Actions from '../constants/actions';

const initialState = {
  address: null,
  balances: {},
  allowances: {},
};

export default handleActions(
  {
    [Actions.SET_ALLOWANCE]: (state, action) => {
      const allowances = Object.assign({}, state.allowances);
      const [token, sender, allowance] = action.payload;
      if (!allowances[token]) {
        allowances[token] = {};
      }
      allowances[token][sender] = allowance;
      return {...state, allowances};
    },
    [Actions.SET_BALANCE]: (state, action) => {
      const balances = Object.assign({}, state.balances);
      const [token, balance] = action.payload;
      balances[token] = balance;
      return {...state, balances};
    },
    [Actions.SET_WALLET_ADDRESS]: (state, action) => {
      return {...state, address: action.payload};
    },
  },
  initialState,
);
