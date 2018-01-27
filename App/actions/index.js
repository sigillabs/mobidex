import { createAction } from "redux-actions";
import * as Actions from "../constants/actions";

export const addErrors = createAction(Actions.ADD_ERRORS);
export const addOrders = createAction(Actions.ADD_ORDERS);
export const addTransactions = createAction(Actions.ADD_TRANSACTIONS);
export const changeWallet = createAction(Actions.CHANGE_WALLET);
export const startLoading = createAction(Actions.START_LOADING);
export const stopLoading = createAction(Actions.STOP_LOADING);

