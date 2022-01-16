export const OPTIMISM_NETWORKS = {
  10: {
    chainId: '0xA',
    chainName: 'Optimism Mainnet',
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
    iconUrls: [
      'https://optimism.io/images/metamask_icon.svg',
      'https://optimism.io/images/metamask_icon.png',
    ],
  },
  69: {
    chainId: '0x45',
    chainName: 'Optimism Kovan',
    rpcUrls: ['https://kovan.optimism.io'],
    blockExplorerUrls: ['https://kovan-optimistic.etherscan.io'],
    iconUrls: [
      'https://optimism.io/images/metamask_icon.svg',
      'https://optimism.io/images/metamask_icon.png',
    ],
  },
};

export const DEFAULT_NETWORKS_PER_ENVIRONMENT = {
  development: 31337,
  staging: 69,
  production: 10,
};

export const supportedChains = [
  {
    name: 'Localhost Network',
    short_name: 'local',
    chain: 'ETH',
    network: 'local',
    chain_id: [31337, '0x7a69'],
    network_id: 31337,
    rpc_url: 'http://127.0.0.1:8545',
    native_currency: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
  {
    name: 'Optimistic Kovan',
    short_name: 'optimism-kovan',
    chain: 'ETH',
    network: 'kovan',
    chain_id: [69, '0x45'],
    network_id: 69,
    rpc_url: 'https://optimism-kovan.infura.io/v3/%PROJECT_ID%',
    native_currency: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
  {
    name: 'Optimistic Ethereum ',
    short_name: 'optimism',
    chain: 'ETH',
    network: 'optimism',
    chain_id: [10, '0xa'],
    network_id: 10,
    rpc_url: 'https://optimism-mainnet.infura.io/v3/%PROJECT_ID%',
    native_currency: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
];
