import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';

const initialState = {
  accessToken: null,
  accessTokenExpirationDate: null,
  refreshToken: null
};

export default handleActions(
  {
    [Actions.SET_BITSKI_CREDENTIALS]: (state, action) => {
      return {
        ...state,
        ...action.payload
      };
    }
  },
  initialState
);
