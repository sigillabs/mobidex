import * as _ from "lodash";
import { Dimensions } from "react-native";
import { handleActions } from "redux-actions";
import * as Actions from "../constants/actions";

const initialState = {
  layout: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
};

export default handleActions({}, initialState);
