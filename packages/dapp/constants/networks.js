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
    shortName: 'local',
    chain: 'ETH',
    network: 'local',
    chainId: 31337,
    networkId: 31337,
    rpcUrl: 'http://127.0.0.1:8545',
    nativeCurrency: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
  {
    name: 'Optimistic Kovan',
    shortName: 'optimism-kovan',
    chain: 'ETH',
    network: 'kovan',
    chainId: 69,
    networkId: 69,
    rpcUrl: 'https://optimism-kovan.infura.io/v3/%PROJECT_ID%',
    nativeCurrency: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
  {
    name: 'Optimistic Ethereum ',
    shortName: 'optimism-mainnet',
    chain: 'ETH',
    network: 'optimism',
    chainId: 10,
    networkId: 10,
    rpcUrl: 'https://optimism-mainnet.infura.io/v3/%PROJECT_ID%',
    nativeCurrency: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
];
