import { combineReducers } from 'redux';
import device from './device';
import error from './error';
import quote from './quote';
import relayer from './relayer';
import settings from './settings';
import ticker from './ticker';
import wallet from './wallet';

export default combineReducers({
  device,
  error,
  quote,
  relayer,
  settings,
  ticker,
  wallet
});
