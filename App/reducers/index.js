import { combineReducers } from "redux";
import device from "./device";
import errors from "./errors";
import ethereum from "./ethereum";
import orders from "./orders";

export default combineReducers({
  device,
  errors,
  ethereum,
  orders
});
