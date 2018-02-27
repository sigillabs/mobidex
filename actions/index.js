import { createAction } from "redux-actions";
import * as Actions from "../constants/actions";

export const addErrors = createAction(Actions.ADD_ERRORS);
export const addOrders = createAction(Actions.ADD_ORDERS);
export const addProcessingOrders = createAction(Actions.ADD_PROCESSING_ORDERS);
export const addTransactions = createAction(Actions.ADD_TRANSACTIONS);
export const addAssets = createAction(Actions.ADD_ASSETS);
export const finishedLoadingProducts = createAction(Actions.FINISHED_LOADING_PRODUCTS);
export const finishedLoadingWallet = createAction(Actions.FINISHED_LOADING_WALLET);
export const removeProcessingOrders = createAction(Actions.REMOVE_PROCESSING_ORDERS);
export const setWallet = createAction(Actions.SET_WALLET);
export const setProducts = createAction(Actions.SET_PRODUCTS);
export const setTokens = createAction(Actions.SET_TOKENS);

