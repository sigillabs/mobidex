import { combineReducers } from "redux";
import device from "./device";
import errors from "./errors";
import navigation from "./navigation";
import settings from "./settings";
import orders from "./orders";
import startup from "./startup";
import tokens from "./tokens";
import transactions from "./transactions";
import wallet from "./wallet";

export default combineReducers({
  device,
  errors,
  navigation,
  orders,
  settings,
  startup,
  tokens,
  transactions,
  wallet
});
