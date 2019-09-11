import { reducer as network } from 'react-native-offline';
import { combineReducers } from 'redux';
import bitski from './bitski';
import device from './device';
import error from './error';
import settings from './settings';
import tokens from './tokens';
import wallet from './wallet';

export default combineReducers({
  bitski,
  device,
  error,
  network,
  settings,
  tokens,
  wallet
});
