const ethers = require('ethers');

require('@nomiclabs/hardhat-ethers');
require('solidity-coverage');

require('./tasks/deploy');
require('./tasks/sale-state');
require('./tasks/mint');

module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.4',
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
    hardhat: {},
    local: {
      url: 'http://localhost:8545',
    },
    docker: {
      url: 'http://hardhat-node:8545',
    },
  },
  defaults: {
    maxGiftable: 100,
    maxTokens: 10000,
    batchSize: 500,
    mintPrice: ethers.utils.parseEther('0.2'),
    earlyMintPrice: ethers.utils.parseEther('0.015'),
    initialCouponSigner: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', // Default hardhat signer[0]
  },
  overrides: {
    gasPrice: ethers.utils.parseUnits('100', 'gwei'),
    gasLimit: 8000000,
  },
};
