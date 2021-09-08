const ethers = require('ethers');

require('@nomiclabs/hardhat-ethers');
require('@eth-optimism/hardhat-ovm');

module.exports = {
  solidity: '0.7.6',
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {},
    local: {
      url: 'http://localhost:8545',
    },
    'local-optimism': {
      url: 'http://localhost:8545',
      ovm: true,
    },
  },
  defaults: {
    maxGiftable: 100,
    maxTokens: 10000,
    daoPercent: 950000, // 95%
    artistPercent: 50000, // 5%
    minPrice: ethers.utils.parseEther('0.2'),
    maxPrice: ethers.utils.parseEther('14'),
    provenance: '0x0000000000000000000000000000000000000000000000000000000000000001',
  },
  overrides: {
    gasPrice: ethers.utils.parseUnits('100', 'gwei'),
    gasLimit: 8000000,
  },
};
