import { ZeroEx } from "0x.js";

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
