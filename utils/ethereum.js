export function getURLFromNetwork(network) {
  switch (network) {
    case 'mainnet':
      return 'https://mainnet.infura.io/';

    default:
      return 'https://kovan.infura.io/';
  }
}
