import ethUtil from 'ethereumjs-util';
import * as _ from 'lodash';

export function getURLFromNetwork(network) {
  switch (network) {
    case 'mainnet':
    case 1:
      return 'https://mainnet.infura.io/';

    default:
      return 'https://kovan.infura.io/';
  }
}

export function stripPrefixesFromTxParams(tx) {
  return _.mapValues(tx, (v, k) => {
    if (k !== 'from' && k !== 'to') {
      return ethUtil.stripHexPrefix(v);
    } else {
      return v;
    }
  });
}

export function chainIDToNetworkName(chainID) {
  switch (chainID) {
    case 1:
      return 'mainnet';

    default:
      return 'kovan';
  }
}
