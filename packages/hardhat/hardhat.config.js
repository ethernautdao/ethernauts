const ethers = require('ethers');

require('@nomiclabs/hardhat-ethers');
require('solidity-coverage');
require('@nomiclabs/hardhat-etherscan');
require('dotenv').config();

require('./tasks/deploy');
require('./tasks/exec');
require('./tasks/mint');
require('./tasks/sale-state');

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
  defaultNetwork: 'hardhat',
  networks: {
    local: {
      url: 'http://localhost:8545',
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk',
      },
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
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API}`,
  },
  defaultParameters: {
    definitiveMaxTokens: 10000,
    definitiveMaxGiftableTokens: 100,
    definitiveBatchSize: 50,
    definitiveProvenanceHash: '0xabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabca',

    initialMintPrice: ethers.utils.parseEther('0.2'),
    initialEarlyMintPrice: ethers.utils.parseEther('0.015'),

    // Default hardhat signer[0]
    // Will be changed at runtime if targeting a real network.
    initialCouponSigner: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    initialUrlChanger: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  },
  customParameters: {
    ['optimistic-kovan']: {
      initialCouponSigner: '0xA227D2b83aB33384124A75872e1f3D71b6341D0b',
      initialUrlChanger: '0xA227D2b83aB33384124A75872e1f3D71b6341D0b',
    },
    ['optimistic-mainnet']: {
      definitiveProvenanceHash:
        '0x00000000000000000000000000000000f04a636d10f42ec5a9d4885d30834a70',
      initialCouponSigner: '0x8818B7d491aE4F69181Fc62C28a67dDE133b4232',
      initialUrlChanger: '0xA4403C8388634b9b01b70763e2C5C44FEC138250',
    },
  },
};
