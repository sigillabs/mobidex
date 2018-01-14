import { createAction } from "redux-actions";
import * as Actions from "../constants/actions";

export const createOrder = createAction(Actions.ADD_ORDERS);

