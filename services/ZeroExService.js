import { ContractDefinitionLoader } from 'web3-contracts-loader';
import EthereumClient from '../clients/ethereum';

const TOKEN_ABI = require('../abi/Token.json');
const WETH_ABI = require('../abi/WETH9.json');
const EXCHANGE_ABI = require('../abi/Exchange_v1.json');

let _store;

/**
 * Keeping contracts around for estimate gas
 */

async function getTokenContract(address) {
  const {
    wallet: { web3 }
  } = _store.getState();
  const ethereumClient = new EthereumClient(web3);
  const networkId = await ethereumClient.getNetworkId();
  return ContractDefinitionLoader({
    web3,
    contractDefinitions: {
      Token: {
        ...TOKEN_ABI,
        networks: {
          [networkId]: {
            address
          }
        }
      }
    },
    options: null
  }).Token;
}

async function getWETHContract(address) {
  const {
    wallet: { web3 }
  } = _store.getState();
  const ethereumClient = new EthereumClient(web3);
  const networkId = await ethereumClient.getNetworkId();
  return ContractDefinitionLoader({
    web3,
    contractDefinitions: {
      WETH: {
        ...WETH_ABI,
        networks: {
          [networkId]: {
            address
          }
        }
      }
    },
    options: null
  }).WETH;
}

async function getExchangeV1Contract(address) {
  const {
    wallet: { web3 }
  } = _store.getState();
  const ethereumClient = new EthereumClient(web3);
  const networkId = await ethereumClient.getNetworkId();
  return ContractDefinitionLoader({
    web3,
    contractDefinitions: {
      Exchange_v1: {
        ...EXCHANGE_ABI,
        networks: {
          [networkId]: {
            address
          }
        }
      }
    },
    options: null
  }).Exchange_v1;
}

export function setStore(store) {
  _store = store;
}
