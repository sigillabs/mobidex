import { combineReducers } from "redux";
import device from "./device";
import errors from "./errors";
import ethereum from "./ethereum";
import trade from "./trade";

export default combineReducers({
  device,
  errors,
  ethereum,
  trade
});
