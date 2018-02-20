import { combineReducers } from "redux";
import device from "./device";
import errors from "./errors";
import navigation from "./navigation";
import relayer from "./relayer";
import settings from "./settings";
import startup from "./startup";
import wallet from "./wallet";

export default combineReducers({
  device,
  errors,
  navigation,
  relayer,
  settings,
  startup,
  wallet
});
