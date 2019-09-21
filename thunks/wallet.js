import {BigNumber} from '@uniswap/sdk';
import {setAllowance, setBalance, setWalletAddress} from '../actions';
import EthereumClient from '../clients/ethereum';
import TokenClient from '../clients/token';
import EtherToken from '../clients/EtherToken';
import {MAX_UINT256} from '../constants';
import {setOfflineRoot, showErrorModal} from '../navigation';
import * as AssetService from '../services/AssetService';
import {WalletService} from '../services/WalletService';

export function loadWalletAddress() {
  return async dispatch => {
    try {
      if (WalletService.instance.isReady) {
        const address = await WalletService.instance.getWalletAddress();
        dispatch(setWalletAddress(address));
      } else {
        dispatch(setWalletAddress(null));
      }
    } catch (error) {
      if (error.message && ~error.message.indexOf('Network is down')) {
        setOfflineRoot();
      } else {
        showErrorModal(error);
      }
    }
  };
}

export function loadAllowance(token, sender) {
  return async dispatch => {
    const asset = AssetService.findAssetByAddress(token);
    const web3 = WalletService.instance.web3;
    const ethereumClient = new EthereumClient(web3);
    const tokenClient = new TokenClient(ethereumClient, asset.address);
    const address = asset.address.toLowerCase();
    const allowance = await tokenClient.getAllowance(sender);

    dispatch(
      setAllowance([token.toLowerCase(), sender.toLowerCase(), allowance]),
    );
  };
}

export function loadBalance(token) {
  return async dispatch => {
    const asset = AssetService.findAssetByAddress(token);
    const web3 = WalletService.instance.web3;
    let address = asset.address;
    let client = new EthereumClient(web3);

    if (!asset.isEthereum) {
      client = new TokenClient(client, asset.address);
      address = address.toLowerCase();
    }

    const balance = await client.getBalance();

    dispatch(setBalance([address, balance]));
  };
}

export function sendTokens(token, to, amount) {
  return async (dispatch, getState) => {
    const {
      wallet: {address},
    } = getState();

    const web3 = WalletService.instance.web3;
    const ethereumClient = new EthereumClient(web3);
    const tokenClient = new TokenClient(ethereumClient, token.address);
    const txhash = await tokenClient.send(to, amount);
  };
}

export function sendEther(to, amount) {
  return async (dispatch, getState) => {
    const {
      wallet: {address},
      settings: {gasPrice},
    } = getState();

    const web3 = WalletService.instance.web3;
    const ethereumClient = new EthereumClient(web3, {gasPrice});
    const txhash = await ethereumClient.send(to, amount);
  };
}

export function unlock(token, exchange) {
  return async (dispatch, getState) => {
    const {
      settings: {gasPrice, gasLimit},
    } = getState();

    const web3 = WalletService.instance.web3;
    const ethereumClient = new EthereumClient(web3, {
      gasPrice,
    });
    const tokenClient = new TokenClient(ethereumClient, token);
    const txhash = await tokenClient.unlock(exchange);
  };
}

export function unwrapAllETH() {
  return async (dispatch, getState) => {
    const {
      settings: {
        weth9: {address: WETHAddress},
        gasPrice,
        gasLimit,
      },
      wallet: {address},
    } = getState();

    const web3 = WalletService.instance.web3;
    const ethereumClient = new EthereumClient(web3, {
      gasPrice,
    });
    const etherTokenClient = new EtherToken(ethereumClient, WETHAddress);
    const amount = await etherTokenClient.balanceOf(address);
    const txhash = await tokenClient.withdraw(amount);
    console.warn(txhash);
  };
}
