export function getURLFromNetwork(network) {
  switch (network) {
    case 'mainnet':
    case 1:
      return 'https://mainnet.infura.io/';

    default:
      return 'https://kovan.infura.io/';
  }
}
