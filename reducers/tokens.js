import { handleActions } from 'redux-actions';

const TOKENS = {
  1: [
    {
      address: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
      symbol: 'BAT',
      name: 'Basic Attention Token',
      decimals: 18
    },
    {
      address: '0xe41d2489571d322189246dafa5ebde1f4699f498',
      symbol: 'ZRX',
      name: 'ZRX',
      decimals: 18
    },
    {
      address: '0x1985365e9f78359a9b6ad760e32412f4a445e862',
      symbol: 'REP',
      name: 'Reputation',
      decimals: 18
    },
    {
      address: '0x42d6622dece394b54999fbd73d108123806f6a18',
      symbol: 'SPANK',
      name: 'SPANK',
      decimals: 18
    },
    {
      address: '0x960b236a07cf122663c4303350609a66a7b288c0',
      symbol: 'ANT',
      name: 'Aragon',
      decimals: 18
    },
    {
      address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
      symbol: 'MKR',
      name: 'Maker',
      decimals: 18
    },
    {
      address: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
      symbol: 'OMG',
      name: 'OmiseGO',
      decimals: 18
    },
    {
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      symbol: 'WBTC',
      name: 'Wrapper Bitcoin',
      decimals: 18
    },
    {
      address: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
      symbol: 'DAI',
      name: 'Dai Stablecoin v1.0',
      decimals: 18
    },
    {
      address: '0x0000000000085d4780b73119b644ae5ecd22b376',
      symbol: 'TUSD',
      name: 'TrueUSD',
      decimals: 18
    },
    {
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6
    },
    {
      address: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
      symbol: 'PAX',
      name: 'Paxos Standard',
      decimals: 18
    }
  ],
  42: [
    {
      address: '0x2002d3812f58e35f0ea1ffbf80a75a38c32175fa',
      symbol: 'ZRX',
      name: 'ZRX',
      decimals: 18
    },
    {
      address: '0x7b6b10caa9e8e9552ba72638ea5b47c25afea1f3',
      symbol: 'MKR',
      name: 'MakerDAO',
      decimals: 18
    },
    {
      address: '0x31fb614e223706f15d0d3c5f4b08bdf0d5c78623',
      symbol: 'GNT',
      name: 'Golem',
      decimals: 18
    },
    {
      address: '0x8cb3971b8eb709c14616bd556ff6683019e90d9c',
      symbol: 'Reputation',
      name: 'REP',
      decimals: 18
    }
  ]
};

// const initialState = __DEV__ ? TOKENS[42] : TOKENS[1];
const initialState = TOKENS[1];

export default handleActions({}, initialState);
