import * as Actions from '../constants/actions';

export default function error(state = null, action) {
  switch (action.type) {
    case Actions.SET_ERROR:
      return action.payload;
    default:
      return state;
  }
}
