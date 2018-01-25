import { combineReducers } from "redux";
import device from "./device";
import errors from "./errors";
import ethereum from "./ethereum";
import g from "./global";
import orders from "./orders";

export default combineReducers({
  device,
  errors,
  ethereum,
  orders,
  global: g
});
