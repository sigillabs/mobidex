import { setGasPrice } from '../actions';
import * as WalletService from '../services/WalletService';

export function refreshGasPrice() {
  return async dispatch => {
    dispatch(setGasPrice(await WalletService.getGasPrice()));
  };
}
