import { combineReducers } from 'redux';
import device from './device';
import error from './error';
import forex from './forex';
import navigation from './navigation';
import relayer from './relayer';
import settings from './settings';
import wallet from './wallet';

export default combineReducers({
  device,
  error,
  forex,
  navigation,
  relayer,
  settings,
  wallet
});
