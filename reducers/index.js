import { combineReducers } from "redux";
import device from "./device";
import errors from "./errors";
import settings from "./settings";
import relayer from "./relayer";
import startup from "./startup";
import wallet from "./wallet";

export default combineReducers({
  device,
  errors,
  relayer,
  settings,
  startup,
  wallet
});
