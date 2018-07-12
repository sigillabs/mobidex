import * as _ from 'lodash';
import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';

const initialState = {
  forex: {},
  token: {}
};

function tickersToState(tickers) {
  const obj = {};
  for (let ticker of _.values(tickers)) {
    if (!obj[ticker.base]) {
      obj[ticker.base] = {};
    }
    obj[ticker.base][ticker.quote] = ticker;
  }
  return obj;
}

export default handleActions(
  {
    [Actions.UPDATE_FOREX_TICKER]: (state, action) => {
      return {
        ...state,
        forex: _.extend({}, state.forex, tickersToState(action.payload))
      };
    },
    [Actions.UPDATE_TOKEN_TICKER]: (state, action) => {
      return {
        ...state,
        token: _.extend({}, state.token, tickersToState(action.payload))
      };
    }
  },
  initialState
);
