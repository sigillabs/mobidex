import { createAction } from 'redux-actions';
import * as Actions from '../constants/actions';

export const addActiveTransactions = createAction(
  Actions.ADD_ACTIVE_TRANSACTIONS
);
export const addAssets = createAction(Actions.ADD_ASSETS);
export const addOrders = createAction(Actions.ADD_ORDERS);
export const addTickerWatching = createAction(Actions.ADD_TICKER_WATCHING);
export const addTransactions = createAction(Actions.ADD_TRANSACTIONS);
export const closeDrawer = createAction(Actions.CLOSE_DRAWER);
export const notProcessing = createAction(Actions.NOT_PROCESSING);
export const openDrawer = createAction(Actions.OPEN_DRAWER);
export const processing = createAction(Actions.PROCESSING);
export const setError = createAction(Actions.SET_ERROR);
export const setForexCurrency = createAction(Actions.SET_FOREX_CURRENCY);
export const setNetwork = createAction(Actions.SET_NETWORK);
export const setOrders = createAction(Actions.SET_ORDERS);
export const setProducts = createAction(Actions.SET_PRODUCTS);
export const setWallet = createAction(Actions.SET_WALLET);
export const setTokens = createAction(Actions.SET_TOKENS);
export const setTransactionHash = createAction(Actions.SET_TRANSACTION_HASH);
export const toggleDrawer = createAction(Actions.TOGGLE_DRAWER);
export const updateForexTicker = createAction(Actions.UPDATE_FOREX_TICKER);
export const updateTokenTicker = createAction(Actions.UPDATE_TOKEN_TICKER);
