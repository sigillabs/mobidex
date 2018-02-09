import { combineReducers } from "redux";
import device from "./device";
import errors from "./errors";
import settings from "./settings";
import orders from "./orders";
import startup from "./startup";
import tokens from "./tokens";
import wallet from "./wallet";

export default combineReducers({
  device,
  errors,
  orders,
  settings,
  startup,
  tokens,
  wallet
});
