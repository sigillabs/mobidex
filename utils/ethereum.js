import { ZeroEx } from "0x.js";
import BigNumber from "bignumber.js";
import { AsyncStorage } from "react-native";

export function getURLFromNetwork(network) {
  switch(network) {
    case "mainnet":
    return "https://mainnet.infura.io/";

    default:
    return "https://kovan.infura.io/";
  }
}

export async function getNetworkId(web3) {
  return await new Promise((resolve, reject) => {
    web3.version.getNetwork((err, network) => {
      if (err) {
        reject(err);
      } else {
        resolve(parseInt(network));
      }
    });
  });
}

export async function getAccount(web3) {
  return await new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, accounts) => {
      if (err) {
        reject(err);
      } else {
        resolve(accounts[0]);
      }
    });
  });
}

export async function getBalance(web3, address) {
  return await new Promise((resolve, reject) => {
    web3.eth.getBalance(address, (err, balance) => {
      if (err) {
        reject(err);
      } else {
        resolve(balance);
      }
    });
  });
}

export async function getZeroExClient(web3) {
  return new ZeroEx(web3.currentProvider, { networkId: await getNetworkId(web3) });
}

export async function getZeroExContractAddress(web3) {
  let zeroEx = await getZeroExClient(web3);
  return await zeroEx.exchange.getContractAddress();
}

export async function getZeroExTokens(web3) {
  let zeroEx = await getZeroExClient(web3);
  return await zeroEx.tokenRegistry.getTokensAsync();
}

export async function getTokenBalance(web3, address) {
  let zeroEx = await getZeroExClient(web3);
  let account = await getAccount(web3);
  return await zeroEx.token.getBalanceAsync(address, account.toString().toLowerCase());
}

export async function getTokenByAddress(web3, address) {
  let key = `token:${address}`;
  let json = await AsyncStorage.getItem(key);

  if (json) {
    return JSON.parse(json);
  }

  let zeroEx = await getZeroExClient(web3);
  let token = await zeroEx.tokenRegistry.getTokenIfExistsAsync(address);
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
  return token && token.symbol == "WETH";
}

export async function wrapETH(web3, amount) {
  let zeroEx = await getZeroExClient(web3);
  let account = await getAccount(web3);
  let token = zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync("WETH");
  return await zeroEx.etherToken.depositAsync(token.address, new BigNumber(amount), account);
}

export async function guaranteeWETHAmount(web3, amount) {
  let zeroEx = await getZeroExClient(web3);
  let token = await zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync("WETH");
  let balance = new BigNumber(await getTokenBalance(web3, token.address));
  if (!(balance.gte(amount))) {
    return wrapETH(web3, balance);
  } else {
    return null;
  }
}
