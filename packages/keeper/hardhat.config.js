const ethers = require('ethers');

require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.9',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    local: {
      url: 'http://localhost:8545',
    },
    docker: {
      url: 'http://hardhat-node:8545',
    },
    ['optimistic-kovan']: {
      url: process.env.NETWORK_ENDPOINT || 'https://kovan.optimism.io',
      accounts: process.env.DEPLOYER_KEY ? [`${process.env.DEPLOYER_KEY}`] : [],
      gasPrice: ethers.utils.parseUnits('0.001', 'gwei').toNumber(),
    },
    ['optimistic-mainnet']: {
      url: process.env.NETWORK_ENDPOINT || 'https://mainnet.optimism.io',
      accounts: process.env.DEPLOYER_KEY ? [`${process.env.DEPLOYER_KEY}`] : [],
      gasPrice: ethers.utils.parseUnits('0.001', 'gwei').toNumber(),
    },
  },
};
