import { AsyncStorage } from "react-native";
import { Actions } from "react-native-router-flux";
import { ZeroEx } from "0x.js";
import BigNumber from "bignumber.js";
import { HttpClient } from "@0xproject/connect";
import { signOrder } from "../utils/orders";
import { addErrors, changeKeys, startLoading, stopLoading } from "../actions";

const BASE_URL = "https://api.radarrelay.com/0x/v0";

export function loadKeyPair() {
  return async (dispatch) => {
    dispatch(startLoading());

    let client = new HttpClient(BASE_URL);

    try {
      console.warn("here");
      let keys = await AsyncStorage.getItem("key");

      if (keys) {
        dispatch(changeKeys(keys));
      } else {
        Actions.onboarding();
      }
    } catch(err) {
      dispatch(addErrors([err]));
    }

    dispatch(stopLoading());
  };
}
