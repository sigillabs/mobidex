import { combineReducers } from 'redux';
import device from './device';
import drawer from './drawer';
import error from './error';
import forex from './forex';
import navigation from './navigation';
import relayer from './relayer';
import settings from './settings';
import wallet from './wallet';

export default combineReducers({
  device,
  drawer,
  error,
  forex,
  navigation,
  relayer,
  settings,
  wallet
});
