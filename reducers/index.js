import { combineReducers } from 'redux';
import device from './device';
import drawer from './drawer';
import error from './error';
import navigation from './navigation';
import relayer from './relayer';
import settings from './settings';
import ticker from './ticker';
import wallet from './wallet';

export default combineReducers({
  device,
  drawer,
  error,
  navigation,
  relayer,
  settings,
  ticker,
  wallet
});
