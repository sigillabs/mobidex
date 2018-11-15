import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';

const initialState = {
  buy: {
    loading: false,
    quote: null,
    error: null
  },
  sell: {
    loading: false,
    quote: null,
    error: null
  }
};

export default handleActions(
  {
    [Actions.SET_QUOTE]: (state, action) => {
      const [side, quote, loading, error] = action.payload;
      const newState = {};

      newState[side] = {
        ...state[side],
        quote,
        loading,
        error
      };

      return {
        ...state,
        ...newState
      };
    }
  },
  initialState
);
