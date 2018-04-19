import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';

const initialState = {
  open: false
};

export default handleActions(
  {
    [Actions.OPEN_DRAWER]: () => {
      return { open: true };
    },
    [Actions.CLOSE_DRAWER]: () => {
      return { open: false };
    },
    [Actions.TOGGLE_DRAWER]: state => {
      return { open: !state.open };
    }
  },
  initialState
);
