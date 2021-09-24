const ethers = require('ethers');

require('@nomiclabs/hardhat-ethers');
require('solidity-coverage');

module.exports = {
  solidity: '0.8.4',
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {},
    local: {
      url: 'http://localhost:8545',
    },
  },
  defaults: {
    maxGiftable: 100,
    maxTokens: 10000,
    mintPrice: ethers.utils.parseEther('0.2'),
  },
  overrides: {
    gasPrice: ethers.utils.parseUnits('100', 'gwei'),
    gasLimit: 8000000,
  },
};
