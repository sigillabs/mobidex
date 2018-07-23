import { ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import ethUtil from 'ethereumjs-util';
import { AsyncStorage } from 'react-native';
import { ContractDefinitionLoader } from 'web3-contracts-loader';
import { getZeroExClient, getAccount, getNetworkId } from './ethereum';

const TokenABI = require('../abi/Token.json');

export async function getTokenBalance(web3, address) {
  let zeroEx = await getZeroExClient(web3);
  let account = await getAccount(web3);
  return await zeroEx.token.getBalanceAsync(
    address,
    account.toString().toLowerCase()
  );
}

export async function getTokensByAddress(web3, addresses) {
  let tokens = [];
  for (let address of addresses) {
    tokens.push(await getTokenByAddress(web3, address));
  }
  return tokens;
}

export async function getTokenByAddress(web3, address, force = false) {
  if (!address) return null;

  let key = `token:${address}`;
  let json = force ? null : await AsyncStorage.getItem(key);

  if (json) {
    return JSON.parse(json);
  }

  let networkId = await getNetworkId(web3);
  let contract = ContractDefinitionLoader({
    web3,
    contractDefinitions: {
      Token: {
        ...TokenABI,
        networks: {
          [networkId]: {
            address
          }
        }
      }
    },
    options: null
  }).Token;

  let name = null;
  let symbol = null;
  let decimals = null;

  try {
    name = await new Promise((resolve, reject) => {
      contract.name.call((err, data) => {
        if (err) return reject(err);
        else return resolve(data);
      });
    });
  } catch (err) {
    console.warn('MOBIDEX: ', 'Could not fetch name', err);
    return null;
  }

  try {
    symbol = await new Promise((resolve, reject) => {
      contract.symbol.call((err, data) => {
        if (err) return reject(err);
        else return resolve(data);
      });
    });
  } catch (err) {
    console.warn('MOBIDEX: ', 'Could not fetch symbol', err);
    return null;
  }

  try {
    decimals = await new Promise((resolve, reject) => {
      contract.decimals.call((err, data) => {
        if (err) return reject(err);
        else return resolve(parseInt(data));
      });
    });
  } catch (err) {
    console.warn('MOBIDEX: ', 'Could not fetch decimals', err);
    return null;
  }

  let token = { address, name, symbol, decimals };

  if (!token.name || !token.symbol || !token.decimals) {
    return null;
  }

  await AsyncStorage.setItem(key, JSON.stringify(token));

  return token;
}

export async function getTokenAllowance(web3, address) {
  let zeroEx = await getZeroExClient(web3);
  let account = await getAccount(web3);
  return await zeroEx.token.getProxyAllowanceAsync(address, account);
}

export async function setTokenUnlimitedAllowance(web3, address) {
  let zeroEx = await getZeroExClient(web3);
  let account = await getAccount(web3);
  return await zeroEx.token.setUnlimitedProxyAllowanceAsync(address, account);
}

export async function isWETHAddress(web3, address) {
  let token = await getTokenByAddress(web3, address);
  return token && token.symbol == 'WETH';
}

export async function wrapEther(web3, amount) {
  let zeroEx = await getZeroExClient(web3);
  let { decimals } = await zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync(
    'WETH'
  );
  let value = ZeroEx.toBaseUnitAmount(new BigNumber(amount), decimals);
  return await wrapWei(web3, value);
}

export async function wrapWei(web3, amount) {
  let zeroEx = await getZeroExClient(web3);
  let account = await getAccount(web3);
  let { address } = await zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync(
    'WETH'
  );
  let value = new BigNumber(amount);
  return await zeroEx.etherToken.depositAsync(
    address,
    value,
    account.toLowerCase()
  );
}

export async function unwrapEther(web3, amount) {
  let zeroEx = await getZeroExClient(web3);
  let { decimals } = await zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync(
    'WETH'
  );
  let value = ZeroEx.toBaseUnitAmount(new BigNumber(amount), decimals);
  return await unwrapWei(web3, value);
}

export async function unwrapWei(web3, amount) {
  let zeroEx = await getZeroExClient(web3);
  let account = await getAccount(web3);
  let { address } = await zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync(
    'WETH'
  );
  let value = new BigNumber(amount);
  return await zeroEx.etherToken.withdrawAsync(
    address,
    value,
    account.toLowerCase()
  );
}

export async function guaranteeWETHAmount(web3, amount) {
  let zeroEx = await getZeroExClient(web3);
  let { decimals } = await zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync(
    'WETH'
  );
  return await guaranteeWETHInWeiAmount(
    web3,
    ZeroEx.toBaseUnitAmount(amount, decimals)
  );
}

export async function guaranteeWETHInWeiAmount(web3, amount) {
  let zeroEx = await getZeroExClient(web3);
  let {
    address,
    decimals
  } = await zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync('WETH');
  let balance = new BigNumber(await getTokenBalance(web3, address));
  let difference = new BigNumber(amount).sub(
    ZeroEx.toBaseUnitAmount(balance, decimals)
  );
  if (difference.gt(0)) {
    return wrapWei(web3, difference);
  } else {
    return null;
  }
}

export async function sendEther(web3, to, amount) {
  let sender = await getAccount(web3);
  let value = ZeroEx.toBaseUnitAmount(new BigNumber(amount), 18).toString();
  return await new Promise((resolve, reject) => {
    web3.eth.sendTransaction({ from: sender, to, value }, function(
      err,
      transactionHash
    ) {
      if (err) return reject(err);
      return resolve(transactionHash);
    });
  });
}

export async function sendTokens(web3, { address, decimals }, to, amount) {
  let account = await getAccount(web3);
  let zeroEx = await getZeroExClient(web3);
  let value = ZeroEx.toBaseUnitAmount(new BigNumber(amount), decimals);
  return await zeroEx.token.transferAsync(
    address,
    account.toLowerCase(),
    `0x${ethUtil.stripHexPrefix(to)}`.toLowerCase(),
    value
  );
}

export function isValidAmount(amount) {
  return /^\d*(\.\d*)?$/.test(amount);
}
