import { createAction } from "redux-actions";
import * as Actions from "../constants/actions";

export const addErrors = createAction(Actions.ADD_ERRORS);
export const addOrders = createAction(Actions.ADD_ORDERS);
export const addTransactions = createAction(Actions.ADD_TRANSACTIONS);
export const finishedLoadingTokens = createAction(Actions.FINISHED_LOADING_TOKENS);
export const finishedLoadingWallet = createAction(Actions.FINISHED_LOADING_WALLET);
export const setWallet = createAction(Actions.SET_WALLET);
export const setQuoteToken = createAction(Actions.SET_QUOTE_TOKEN);
export const setBaseToken = createAction(Actions.SET_BASE_TOKEN);
export const setTokens = createAction(Actions.SET_TOKENS);
