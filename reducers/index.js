import { combineReducers } from "redux";
import device from "./device";
import error from "./error";
import navigation from "./navigation";
import relayer from "./relayer";
import settings from "./settings";
import wallet from "./wallet";

export default combineReducers({
  device,
  error,
  navigation,
  relayer,
  settings,
  wallet
});
