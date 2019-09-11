import {createAction} from 'redux-actions';
import * as Actions from '../constants/actions';

export const setAllowance = createAction(Actions.SET_ALLOWANCE);
export const setBalance = createAction(Actions.SET_BALANCE);
export const setBitskiCredentials = createAction(
  Actions.SET_BITSKI_CREDENTIALS,
);
export const setError = createAction(Actions.SET_ERROR);
export const setGasLevel = createAction(Actions.SET_GAS_LEVEL);
export const setGasLimit = createAction(Actions.SET_GAS_LIMIT);
export const setGasPrice = createAction(Actions.SET_GAS_PRICE);
export const setGasStation = createAction(Actions.SET_GAS_STATION);
export const setNetwork = createAction(Actions.SET_NETWORK);
export const setWalletAddress = createAction(Actions.SET_WALLET_ADDRESS);
