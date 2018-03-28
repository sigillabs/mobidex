import { createAction } from "redux-actions";
import * as Actions from "../constants/actions";

export const addOrders = createAction(Actions.ADD_ORDERS);
export const addTransactions = createAction(Actions.ADD_TRANSACTIONS);
export const addAssets = createAction(Actions.ADD_ASSETS);
export const processing = createAction(Actions.PROCESSING);
export const notProcessing = createAction(Actions.NOT_PROCESSING);
export const setBaseToken = createAction(Actions.SET_BASE_TOKEN);
export const setError = createAction(Actions.SET_ERROR);
export const setForexCurrency = createAction(Actions.SET_FOREX_CURRENCY);
export const setForexPrice = createAction(Actions.SET_FOREX_PRICE);
export const setNetwork = createAction(Actions.SET_NETWORK);
export const setOrders = createAction(Actions.SET_ORDERS);
export const setProducts = createAction(Actions.SET_PRODUCTS);
export const setQuoteToken = createAction(Actions.SET_QUOTE_TOKEN);
export const setWallet = createAction(Actions.SET_WALLET);
export const setTokens = createAction(Actions.SET_TOKENS);
export const setTransactionHash = createAction(Actions.SET_TRANSACTION_HASH);

