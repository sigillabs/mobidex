import { ZeroEx } from '0x.js';

export async function getBalance(web3, address = null) {
  let account = await getAccount(web3);
  return await new Promise((resolve, reject) => {
    web3.eth.getBalance(
      address
        ? address.toString().toLowerCase()
        : account.toString().toLowerCase(),
      (err, balance) => {
        if (err) {
          reject(err);
        } else {
          resolve(balance);
        }
      }
    );
  });
}

export function getURLFromNetwork(network) {
  switch (network) {
    case 'mainnet':
      return 'https://mainnet.infura.io/';

    default:
      return 'https://kovan.infura.io/';
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

export async function getZeroExClient(web3) {
  return new ZeroEx(web3.currentProvider, {
    networkId: await getNetworkId(web3)
  });
}

export async function getZeroExContractAddress(web3) {
  let zeroEx = await getZeroExClient(web3);
  return await zeroEx.exchange.getContractAddress();
}

export async function getZeroExTokens(web3) {
  let zeroEx = await getZeroExClient(web3);
  return await zeroEx.tokenRegistry.getTokensAsync();
}
