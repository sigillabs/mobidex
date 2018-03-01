import { createAction } from "redux-actions";
import * as Actions from "../constants/actions";

export const addOrders = createAction(Actions.ADD_ORDERS);
export const addTransactions = createAction(Actions.ADD_TRANSACTIONS);
export const addAssets = createAction(Actions.ADD_ASSETS);
export const setBaseToken = createAction(Actions.SET_BASE_TOKEN);
export const setError = createAction(Actions.SET_ERROR);
export const setQuoteToken = createAction(Actions.SET_QUOTE_TOKEN);
export const setProducts = createAction(Actions.SET_PRODUCTS);
export const setWallet = createAction(Actions.SET_WALLET);
export const setTokens = createAction(Actions.SET_TOKENS);
export const setNetwork = createAction(Actions.SET_NETWORK);

